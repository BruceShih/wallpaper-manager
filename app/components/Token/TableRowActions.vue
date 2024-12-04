<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { UserToken } from '~~/server/utils/drizzle'

interface TokenTableRowActionsProps {
  row: Row<UserToken>
}

defineProps<TokenTableRowActionsProps>()

const store = useTokenStore()

async function onUpdate(id: number, enable: boolean) {
  await store.updateToken(id, enable)
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
