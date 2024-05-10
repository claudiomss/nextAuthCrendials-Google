import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export default async function Index(){
    const session = await getServerSession(authOptions)
    
    if(session?.user){
        return(
            <h1>ADMIN{session?.user.username || session.user.name}</h1>
        )
    } 

    return <h2>Por Favor faça o login</h2>
}