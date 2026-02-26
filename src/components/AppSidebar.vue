<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { LayoutDashboard } from 'lucide-vue-next'
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-zinc-950 border-r border-zinc-800 text-white">
      <SidebarGroup>
        <SidebarGroupLabel class="text-zinc-400">Navegação</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as-child>
                <router-link to="/cards" class="hover:bg-zinc-900 hover:text-white">
                  <LayoutDashboard class="w-4 h-4 mr-2" />
                  <span>Marketplace</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
