"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronRight, Layers } from "lucide-react"

import { modules } from "@/lib/config/modules"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Layers className="size-5 text-primary" />
          <span className="text-base font-semibold">RyanERP</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map((mod) => {
                const isModuleActive = pathname.startsWith(mod.href)
                const Icon = mod.icon

                if (!mod.subItems || mod.subItems.length === 0) {
                  return (
                    <SidebarMenuItem key={mod.code}>
                      <SidebarMenuButton
                        isActive={isModuleActive}
                        tooltip={mod.name}
                        render={<Link href={mod.href} />}
                      >
                        <Icon />
                        <span>{mod.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                return (
                  <Collapsible.Root
                    key={mod.code}
                    defaultOpen={isModuleActive}
                  >
                    <SidebarMenuItem>
                      <Collapsible.Trigger
                        render={
                          <SidebarMenuButton
                            isActive={isModuleActive}
                            tooltip={mod.name}
                          />
                        }
                      >
                        <Icon />
                        <span>{mod.name}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 [[data-panel-open]_&]:rotate-90" />
                      </Collapsible.Trigger>
                      <Collapsible.Panel>
                        <SidebarMenuSub>
                          {mod.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href
                            return (
                              <SidebarMenuSubItem key={sub.href}>
                                <SidebarMenuSubButton
                                  isActive={isSubActive}
                                  render={<Link href={sub.href} />}
                                >
                                  <span>{sub.name}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </Collapsible.Panel>
                    </SidebarMenuItem>
                  </Collapsible.Root>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
