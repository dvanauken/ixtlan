// src/app/tree/ixt-tree.provider.ts
import { TreeNode } from '../../components/ixt-tree/ixt-tree.component';

export class IxtTreeProvider {
    treeData: TreeNode[] = [
        {
            id: '1',
            label: 'Project Files',
            children: [
                {
                    id: '1.1',
                    label: 'src',
                    children: [
                        {
                            id: '1.1.1',
                            label: 'app',
                            children: [
                                { id: '1.1.1.1', label: 'components' },
                                { id: '1.1.1.2', label: 'services' }
                            ]
                        },
                        { id: '1.1.2', label: 'assets' }
                    ]
                },
                {
                    id: '1.2',
                    label: 'config',
                    children: [
                        { id: '1.2.1', label: 'tsconfig.json' },
                        { id: '1.2.2', label: 'package.json' }
                    ]
                }
            ]
        }
    ];
}