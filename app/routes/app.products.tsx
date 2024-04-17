import { Layout, Page, Text, Card, Button, Box, ResourceList, ResourceItem, Thumbnail } from "@shopify/polaris"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { authenticate } from "~/shopify.server"
import { useLoaderData, json } from "@remix-run/react"
import { ProductIcon } from "@shopify/polaris-icons"

export const loader = async ({request}: LoaderFunctionArgs) => {
    const {admin} = await authenticate.admin(request)

    const response = admin.graphql(`
    #garphql
    query fetchProducts {
        products(first: 10){
            edges{
                node{
                    id
                    title
                    handle
                    featuredImage{
                        url
                        altText
                    }

                }
            }
        }
    }`)

    const productsData = (await (await response).json()).data
    console.log(productsData)
    return json({
        products: productsData.products
    })
}

export default function Products(){
    const {products} = useLoaderData<typeof loader>();
    console.log(products)
    
    const renderMedia = (image: any) => {
        return image ? <Thumbnail source={image.url} alt={image.altText}/>
        : <Thumbnail source={ProductIcon} alt="Product"/>
    }

    const renderItem = (item: typeof products[number]) => {
        const {id, url, title, handle, featuredImage} = item.node;
        console.log(title)


        return(
            <ResourceItem 
                id={id}
                url={url}
                media={renderMedia(featuredImage)}
            >
                <Text as="h5" variant="bodyMd">{title}</Text>
                <div>{handle}</div>
            </ResourceItem>
        )
    }

    return(
        <Page>
            <ui-title-bar title="Products">
                <button variant="primary" onClick={()=> {
                    shopify.modal.show("create-product-modal")
                }}>Create a new product</button>

            </ui-title-bar>

            <ui-modal id="create-product-modal">
                <ui-title-bar title="Create a new product">
                    <button variant="primary" onClick={()=> {
                        shopify.modal.hide("create-product-modal")
                    }}>Ok</button>
                </ui-title-bar>
                <Box padding="500">
                    you can create a new product here in sometime
                </Box>
            </ui-modal>
            <Layout>
                <Layout.Section>
                    <Card>
                        {/* <Text as="span" variant="bodyLg">{}</Text>
                        <Text as="h5" variant="bodyMd">Hello world</Text>
                        <Button variant="primary" onClick={()=> shopify.toast.show("The button is working now.")}>Button</Button> */}
                        <ResourceList 
                            resourceName={{ singular:'Product', plural: 'Products' }}
                            items={products}
                            renderItem={renderItem}
                        />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}