import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from 'bcrypt'
import * as z from 'zod'

   //Define a schema do input
   const userSchema = z
   .object({
       username: z.string().min(1, "Usuário requerido!").max(100),
       email: z.string().min(1, "Email requerido!").email("Email inválido"),
       password: z
        .string()
        .min(1, "Senha requerida!")
        .min(8, "Senha deve ter pelo menos 8 caracteres"),
       // confirmPassword: z.string().min(1, "Confirmação da senha requerida!")
   })
   // .refine((data) => data.password === data.confirmPassword, {
   //     path: ['confirmPassword'],
   //     message: "Senhas não conferem!"
   // })
   
export async function POST(req: Request) {
 
    
    try {
        const body = await req.json()
        // const {email, username, password} = body
        const {email, username, password} = userSchema.parse(body)



     

        //Verificar se o email existe
        const existingUserEmail = await db.user.findUnique({
            where: {email: email}
        })
        if(existingUserEmail) {
            return NextResponse.json({user: null, message: "Usuário com esse email já existe!"}, {status: 409})
        }

          //Verificar se o usuario existe
          const existingUserName = await db.user.findUnique({
            where: {username: username}
        })
        if(existingUserName) {
            return NextResponse.json({user: null, message: "Usuário com esse nome já existe!"}, {status: 409})
        }

        const hashedPassword = await hash(password, 10)
        
        const newUser = await db.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        const { password: newUserPassword, ...rest} = newUser

        return NextResponse.json({user: rest, message: "Usuario criado com sucesso!"}, {status: 201})
    } catch (error) {
        return NextResponse.json({ message: "Algo deu errado!"}, {status: 500})

    }
}