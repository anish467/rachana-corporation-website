import ProductsPageClient from "@/components/products-page-client";
import {getProducts} from "@/lib/products";
export default async function ProductsPage(){const products=await getProducts();return <ProductsPageClient products={products}/>;}
