import {NextRequest,NextResponse} from "next/server";
import {Resend} from "resend";
import {enquirySchema} from "@/lib/validation";
export const runtime="nodejs";
export async function POST(req:NextRequest){
  const origin=req.headers.get("origin");const host=req.headers.get("host");if(origin&&host){try{if(new URL(origin).host!==host)return NextResponse.json({error:"Invalid request origin."},{status:403});}catch{return NextResponse.json({error:"Invalid request origin."},{status:403});}}
  let body:unknown;try{body=await req.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
  const parsed=enquirySchema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Please check the required fields and try again."},{status:400});
  const {name,company,email,phone,subject,message,website}=parsed.data;if(website)return NextResponse.json({ok:true});
  if(!process.env.RESEND_API_KEY||!process.env.CONTACT_TO_EMAIL||!process.env.CONTACT_FROM_EMAIL)return NextResponse.json({error:"Enquiry email is not configured yet. Please contact us by phone or email."},{status:503});
  const resend=new Resend(process.env.RESEND_API_KEY);const safe=(s:string)=>s.replace(/[<>]/g,"");
  try{const result=await resend.emails.send({from:process.env.CONTACT_FROM_EMAIL,to:process.env.CONTACT_TO_EMAIL,replyTo:email,subject:`Website enquiry${subject?`: ${safe(subject)}`:""} — ${safe(name)}`,text:[`Name: ${safe(name)}`,`Company: ${safe(company||"Not provided")}`,`Email: ${safe(email)}`,`Phone: ${safe(phone||"Not provided")}`,`Subject: ${safe(subject||"Not provided")}`,"", "Message:",message].join("\n")});if(result.error)throw new Error(result.error.message);return NextResponse.json({ok:true});}
  catch(error){console.error("Enquiry email failed",error);return NextResponse.json({error:"We couldn't send your enquiry right now. Please try again or email us directly."},{status:502});}
}
