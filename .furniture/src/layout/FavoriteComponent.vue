<template>
    <Button :icon="Favorito ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" size="small" style="padding: 0px 12px; width: 2rem; height: 2rem;" class="bg-white border-none text-black-alpha-90" rounded severity="secondary" @click="manageFavorite()" />
</template>
<script>
import { push } from 'notivue'
import supabase from '../lib/supabaseClient'

export default {
props: ['idProducto'],
components: {},
data() {
    return {
        Favorito: false,
    }
},
watch: {
    'idProducto': function(newQ, oldQ) {
      this.loadFavorite(newQ);
    }
},
created() {
    this.loadFavorite(this.idProducto)
},
methods: {
    async loadFavorite(idProducto) {
        let { data: Favoritos, error } = await supabase
        .from('Favoritos')
        .select("*")
        .eq('idProducto', idProducto)

        if (Favoritos.length > 0) this.Favorito = true;
        else this.Favorito = false;
    },
    async manageFavorite() {
        const { data: { user } } = await supabase.auth.getUser()

        if (this.Favorito) {
            // Eliminar del favorito
            const { error } = await supabase
            .from('Favoritos')
            .delete()
            .eq('idProducto', this.idProducto)

            if (error) push.error(error.message);
            else this.Favorito = false;
        } 
        else { 
            // Guardar el favorito
            const { data, error } = await supabase
            .from('Favoritos')
            .insert([
                { idProducto: this.idProducto, idUsuario: user.id },
            ])
            .select()

            if (error) push.error(error.message);
            else this.Favorito = true;
        }
    } 
}
};
</script>
<style>

</style>