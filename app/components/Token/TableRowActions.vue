<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'
import { useToast } from '~/components/ui/toast/use-toast'

interface TokenTableRowActionsProps {
  row: Row<UserToken>
}

defineProps<TokenTableRowActionsProps>()

const { toast } = useToast()
const api = useWallpaperService()

async function onUpdate(id: number, enable: boolean) {
  const { error } = await api.token.update(id, enable)

  if (error.value) {
    toast({
      title: 'Failed to update token',
      variant: 'destructive'
    })
  }
  else {
    toast({
      title: 'Token updated'
    })
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        class="flex size-8 p-0 data-[state=open]:bg-muted"
        variant="ghost"
      >
        <Icon
          class="size-4"
          name="radix-icons:dots-horizontal"
        />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      class="w-[160px]"
    >
      <DropdownMenuItem @select="onUpdate(row.original.id, row.original.enabled)">
        <template v-if="row.original.enabled">
          Disable
        </template>
        <template v-else>
          Enable
        </template>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
