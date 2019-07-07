<template>
    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ modalTitle }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            <div class="modal-body">
                <slot />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
                <button type="button" class="btn btn-primary" @click="onPositiveClicked">{{ positiveButton }}</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modal',
    props: {
        modalTitle: String,
        positiveButton: String,
        onPositiveClicked: Function
    }
}
</script>

