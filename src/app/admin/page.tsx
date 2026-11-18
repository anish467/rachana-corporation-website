import {redirect} from "next/navigation";import {getAdmin} from "@/lib/auth";import {db} from "@/lib/db";import {AdminDashboard} from "@/components/admin-dashboard";
export const dynamic="force-dynamic";
export default async function AdminPage(){const admin=await getAdmin();if(!admin)redirect("/admin/login");const products=await db.product.findMany({orderBy:[{sortOrder:"asc"},{name:"asc"}]});return <AdminDashboard adminEmail={admin.email} initialProducts={products}/>}
