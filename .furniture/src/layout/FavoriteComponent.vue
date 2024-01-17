<template>
    <Button :icon="$store.state.favoritesProducts.some(x => x.idProducto == idProducto) ? 'fa-solid fa-heart text-red-400' : 'fa-regular fa-heart'" size="small" style="padding: 0px 12px; width: 2rem; height: 2rem;" class="bg-white border-none text-black-alpha-90" rounded severity="secondary" @click="manageFavorite()" />
</template>
<script>
import { push } from 'notivue'
import supabase from '../lib/supabaseClient'

export default {
props: ['idProducto'],
components: {},
data() {
    return {}
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
        this.$store.dispatch('fetchFavorites');
    },
    async manageFavorite() {
        const { data: { user } } = await supabase.auth.getUser()

        if (this.$store.state.favoritesProducts.some(x => x.idProducto == this.idProducto)) {
            // Eliminar del favorito
            const { error } = await supabase
            .from('Favoritos')
            .delete()
            .eq('idProducto', this.idProducto)

            if (error) push.error(error.message);
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
        }

        this.$store.dispatch('fetchFavorites');
    } 
}
};
</script>
<style>

</style>