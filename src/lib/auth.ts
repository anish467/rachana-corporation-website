import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
const COOKIE = "rachana_admin_session";
function secret() { const value=process.env.AUTH_SECRET; if(!value || value.length<32) throw new Error("AUTH_SECRET must be at least 32 characters."); return new TextEncoder().encode(value); }
export async function signIn(email:string,password:string) {
  const user=await db.adminUser.findUnique({where:{email:email.toLowerCase().trim()}});
  if(!user || !(await bcrypt.compare(password,user.passwordHash))) return false;
  const token=await new SignJWT({sub:user.id,email:user.email,role:"admin"}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(secret());
  (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*8});
  return true;
}
export async function getAdmin() {
  const token=(await cookies()).get(COOKIE)?.value;
  if(!token) return null;
  try { const {payload}=await jwtVerify(token,secret()); if(payload.role!=="admin" || !payload.sub) return null; return {id:payload.sub,email:String(payload.email ?? "")}; }
  catch { return null; }
}
export async function signOut() { (await cookies()).delete(COOKIE); }
export const sessionCookieName=COOKIE;
