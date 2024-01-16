<template>
<div class="h-full flex justify-content-center align-items-center">
    <div class="p-4 border-200 surface-100 border-1 border-round w-full lg:w-6  my-6">
        <div class="text-center mb-5">
            <img src="/src/assets/logo-black-sm.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Bienvenido de nuevo</div>
            <span class="text-600 font-medium line-height-3">¿Todavía no tienes una cuenta?</span>
            <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer" @click="this.$router.push('/SignUp')">Créala</a>
        </div>
    
        <div>
            <label for="email1" class="block text-900 font-medium mb-2">Correo</label>
            <InputText id="email1" type="text" placeholder="Correo electrónico" @keyup.enter="signIn()" v-model="email" class="w-full mb-3" />
    
            <label for="password1" class="block text-900 font-medium mb-2">Contraseña</label>
            <InputText id="password1" type="password" placeholder="Contraseña" @keyup.enter="signIn()" v-model="password" class="w-full mb-3" />
    
            <div class="flex align-items-center justify-content-between mb-4">
                <a class="font-medium no-underline text-blue-500 text-right cursor-pointer">¿Has olvidado la contraseña?</a>
            </div>
    
            <Button label="Iniciar Sesión" icon="pi pi-user" class="w-full" @click="signIn()"></Button>
        </div>
    </div>
</div>
</template>

<style>

</style>
<script>
import supabase from '../lib/supabaseClient'
import { push } from 'notivue'

export default {
  components: {

  },
  data() {
    return {
        email: null,
        password: null
    }
  },
  mounted() {
    
  },
  methods: {
    async signIn() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password,
        })
        
        if (error) push.error(error.message);
        else { 
            push.success('Inicio de sesión exitoso');
            this.$router.push('/');
        }
    }
  }
};
</script>