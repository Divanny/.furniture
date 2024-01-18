<template>
<div class="h-full flex justify-content-center align-items-center">
    <div class="border-200 border-1 surface-100 p-4 border-round w-full lg:w-6 my-6">
        <div class="text-center mb-5">
            <img src="/src/assets/logo-black-sm.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
            <span class="text-600 font-medium line-height-3">¿Ya posees una cuenta?</span>
            <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="goToSignIn">Inicia sesión</a>
        </div>
    
        <div>
            <label for="email1" class="block text-900 font-medium mb-2">Correo</label>
            <InputText id="email1" type="text" placeholder="Correo electrónico" @keyup.enter="signUpNewUser()" v-model="email" class="w-full mb-3" />
    
            <label for="password1" class="block text-900 font-medium mb-2">Contraseña</label>
            <InputText id="password1" type="password" placeholder="Contraseña" @keyup.enter="signUpNewUser()" v-model="password" class="w-full mb-4" />
    
            <Button label="Registrar la cuenta" icon="pi pi-user" class="w-full" @click="signUpNewUser()"></Button>
        </div>
    </div>
</div>
</template>

<style>

</style>
<script setup>
import { ref } from 'vue';
import supabase from '../lib/supabaseClient';
import { push } from 'notivue'
import { useRouter, useRoute } from 'vue-router'

const email = ref(null);
const password = ref(null);
const router = useRouter()
const route = useRoute()

const signUpNewUser = async () => {
    if (email.value && password.value) {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
            emailRedirectTo: 'http://localhost:5174/'
            }
        });

        const usuario = data;

        if (error) push.error(error.message);
        else { 
            push.success('Registro de usuario exitoso');

            const { data, error } = await supabase
            .from('Carritos')
            .insert([
                { idUsuario: usuario.user.id, Activo: true },
            ])
            .select()
          
            router.push('/');
        }
    }
};

const goToSignIn = () => {
    router.push('/SignIn');
};
</script>