<script setup lang="ts">
const emit = defineEmits(['search'])
// interface DataTableToolbarProps {
//   table: Table<Image>
// }

// const props = defineProps<DataTableToolbarProps>()
const name = defineModel<string>('name')
const sort = defineModel<'date' | 'name'>('sort')
const order = defineModel<'asc' | 'desc'>('order')
const loading = ref(false)

const sortByOptions = [
  { label: 'Date', value: 'date' },
  { label: 'Name', value: 'name' }
]
const orderByOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' }
]

// TODO: change to the actual schema after db migration
// const nsfwOptions = [
//   {
//     label: 'NSFW',
//     value: true
//   },
//   {
//     label: 'SFW',
//     value: false
//   }
// ]

// const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
</script>

<template>
  <div class="flex items-center space-x-2">
    <!-- <Input
        class="h-8 w-[150px] lg:w-[250px]"
        :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''"
        placeholder="Filter tasks..."
        @input="table.getColumn('title')?.setFilterValue($event.target.value)"
      /> -->
    <!-- <FilterSelect
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        :options="nsfwOptions"
        title="Status"
      /> -->

    <!-- <Button
        v-if="isFiltered"
        class="h-8 px-2 lg:px-3"
        variant="ghost"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon
          class="ml-2 size-4"
          name="radix-icons:cross-2"
        />
      </Button> -->
    <Input
      v-model="name"
      class="w-[150px] lg:w-[250px]"
      placeholder="Wallpaper name..."
      type="text"
    />
    <Select v-model="sort">
      <SelectTrigger class="w-[120px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem
            v-for="(item, index) in sortByOptions"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select v-model="order">
      <SelectTrigger class="w-[120px]">
        <SelectValue placeholder="Order by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem
            v-for="(item, index) in orderByOptions"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Button
      :disabled="loading"
      @click="emit('search')"
    >
      <Icon
        v-if="loading"
        class="animate-spin"
        name="radix-icons:reload"
      />
      <template v-if="loading">
        Searching...
      </template>
      <template v-else>
        Search
      </template>
    </Button>
    <!-- <ViewOptionSelect :table="table" /> -->
  </div>
</template>
