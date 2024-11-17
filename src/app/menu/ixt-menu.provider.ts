// ixt-menu.provider.ts
import { Injectable } from '@angular/core';
import { MenuNode } from 'src/components/ixt-menu';

@Injectable({
  providedIn: 'root'
})
export class IxtMenuProvider {
  private _menuData: MenuNode[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Components',
      icon: 'widgets',
      children: [
        { 
          label: 'Form Controls',
          icon: 'input',
          children: [
            { label: 'Autocomplete', route: '/components/autocomplete' },
            { label: 'Input', route: '/components/input' },
            { label: 'Select', route: '/components/select' },
            { label: 'Checkbox', route: '/components/checkbox' },
            { label: 'Radio', route: '/components/radio' }
          ]
        },
        {
          label: 'Data Display',
          icon: 'table_chart',
          children: [
            { label: 'Table', route: '/components/table' },
            { label: 'Tree', route: '/components/tree' },
            { label: 'Matrix', route: '/components/matrix' },
            { label: 'Cards', route: '/components/cards' }
          ]
        },
        {
          label: 'Layout',
          icon: 'grid_view',
          children: [
            { label: 'Split Pane', route: '/components/split-pane' },
            { label: 'Holy Grail', route: '/components/holy-grail' },
            { label: 'Panels', route: '/components/panels' },
            { label: 'Tabs', route: '/components/tabs' }
          ]
        },
        {
          label: 'Navigation',
          icon: 'menu',
          children: [
            { label: 'Menu', route: '/components/menu' },
            { label: 'Breadcrumbs', route: '/components/breadcrumbs' },
            { label: 'Tabs', route: '/components/tabs' },
            { label: 'Stepper', route: '/components/stepper' }
          ]
        },
        {
          label: 'Feedback',
          icon: 'feedback',
          children: [
            { label: 'Dialog', route: '/components/dialog' },
            { label: 'Progress', route: '/components/progress' },
            { label: 'Spinner', route: '/components/spinner' },
            { label: 'Toast', route: '/components/toast' }
          ]
        }
      ]
    },
    {
      label: 'Data Management',
      icon: 'storage',
      children: [
        {
          label: 'Layer Management',
          icon: 'layers',
          children: [
            { label: 'Layer Manager', route: '/management/layers' },
            { label: 'Layer Groups', route: '/management/layer-groups' },
            { label: 'Layer Settings', route: '/management/layer-settings' }
          ]
        },
        {
          label: 'Data Sources',
          icon: 'source',
          children: [
            { label: 'Connections', route: '/data/connections' },
            { label: 'Query Builder', route: '/data/query-builder' },
            { label: 'Import Data', route: '/data/import' }
          ]
        }
      ]
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      children: [
        {
          label: 'Reports',
          icon: 'assessment',
          children: [
            { label: 'Create Report', route: '/analytics/create-report' },
            { label: 'View Reports', route: '/analytics/view-reports' },
            { label: 'Schedule Reports', route: '/analytics/schedule-reports' }
          ]
        },
        {
          label: 'Visualizations',
          icon: 'bar_chart',
          children: [
            { label: 'Charts', route: '/analytics/charts' },
            { label: 'Dashboards', route: '/analytics/dashboards' },
            { label: 'Maps', route: '/analytics/maps' }
          ]
        },
        {
          label: 'Expression Builder',
          icon: 'code',
          route: '/analytics/expression-builder'
        }
      ]
    },
    {
      label: 'Administration',
      icon: 'admin_panel_settings',
      children: [
        {
          label: 'User Management',
          icon: 'people',
          children: [
            { label: 'Users', route: '/admin/users' },
            { label: 'Roles', route: '/admin/roles' },
            { label: 'Permissions', route: '/admin/permissions' }
          ]
        },
        {
          label: 'System Settings',
          icon: 'settings',
          children: [
            { label: 'General', route: '/admin/settings/general' },
            { label: 'Security', route: '/admin/settings/security' },
            { label: 'Integrations', route: '/admin/settings/integrations' },
            { label: 'Notifications', route: '/admin/settings/notifications' }
          ]
        },
        {
          label: 'Monitoring',
          icon: 'monitoring',
          children: [
            { label: 'Logs', route: '/admin/monitoring/logs' },
            { label: 'Performance', route: '/admin/monitoring/performance' },
            { label: 'Alerts', route: '/admin/monitoring/alerts' }
          ]
        }
      ]
    },
    {
      label: 'Help',
      icon: 'help',
      children: [
        { label: 'Documentation', route: '/help/docs' },
        { label: 'API Reference', route: '/help/api' },
        { label: 'Support', route: '/help/support' },
        { label: 'About', route: '/help/about' }
      ]
    }
  ];

  getMenuData(): MenuNode[] {
    return this._menuData;
  }

  setMenuData(data: MenuNode[]): void {
    this._menuData = data;
  }
}