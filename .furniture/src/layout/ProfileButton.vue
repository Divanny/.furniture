<template>
    <Button v-if="store.state.authenticated" size="large" @click="openProfile" id="profile-btn" aria-haspopup="true" aria-controls="overlay_menu" icon="pi pi-user" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
    <Button v-else size="large" @click="sendToSignIn" id="profile-btn" aria-haspopup="true" aria-controls="overlay_menu" icon="pi pi-user" severity="secondary" class="text-black-alpha-90 mx-1 rounded-5" text rounded />
    <Menu ref="menu" id="overlay_tmenu" class="w-full md:w-15rem min-w-0	" :model="itemsProfileMenu" :popup="true" appendTo="body">
        <template #start>
            <div class="relative overflow-hidden w-full flex align-items-center p-2 pl-3 text-color border-noround">
                <Avatar :label="store.state.authenticated.email[0]" class="mr-2" shape="circle" />
                <span class="inline-flex flex-column">
                    <span class="font-bold text-sm">{{ store.state.authenticated.email }}</span>
                </span>
            </div>
            <hr class="mx-1 border-top-1 border-none surface-border" />
        </template>
        <template #item="{ item, props }">
            <a class="flex align-items-center" v-bind="props.action" v-if="(!item.administrador) || (item.administrador == store.state.authenticated.administrador)">
                <span :class="item.icon + ' text-sm'" />
                <span class="ml-2 text-sm">{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { push } from 'notivue'
import supabase from '../lib/supabaseClient'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const menu = ref();
const itemsProfileMenu = ref([
    {
        label: 'Administrar productos',
        icon: 'pi pi-cog',
        administrador: true,
        command: () => {
            router.push('/AdministrarProductos')
        }
    },
    {
        label: 'Mis pedidos',
        icon: 'pi pi-truck',
        administrador: false,
        command: () => {
            router.push('/Pedidos')
        }
    },
    {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        administrador: false,
        command: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) push.error(error.message)
            else { 
                push.success("Ha cerrado sesión exitosamente")
                store.commit('setAuthenticated', null)
                router.push('/');
            }
        }
    }
]);

const openProfile = async (event) => {
    menu.value.toggle(event)
}

onMounted(async () => {
    await validateSession()
})

const validateSession = async() => {
    const { data } = await supabase.auth.getSession();
    if (data.session) { 
        let { data: Administradores } = await supabase
            .from('Administradores')
            .select('*')
            .eq('idUsuario', data.session.user.id)
            
        if (Administradores.length > 0) data.session.user.administrador = true;
        store.commit('setAuthenticated', data.session.user)
    }
    else {
        store.commit('setAuthenticated', null);
        router.push('/')
    }
}
const sendToSignIn = () => {
    router.push('/SignIn')
    push.warning("Debe iniciar sesión")
}
</script>
