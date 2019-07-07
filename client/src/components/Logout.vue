<template>
    <div></div>
</template>


<script>
export default {
    name: 'logout',
    beforeCreate() {
        localStorage.removeItem('username')
        localStorage.removeItem('nama')
        localStorage.removeItem('no_hp')
        localStorage.removeItem('tipe')
        localStorage.removeItem('token')
        this.$router.push('dashboard')
    }
}
</script>
