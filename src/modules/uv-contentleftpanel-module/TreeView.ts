import {BaseCommands} from "../uv-shared-module/BaseCommands";
import {BaseView} from "../uv-shared-module/BaseView";
import {Commands} from "../../extensions/uv-seadragon-extension/Commands";
import IRange = Manifold.IRange;
import ITreeNode = Manifold.ITreeNode;
import MultiSelectState = Manifold.MultiSelectState;

export class TreeView extends BaseView {

    isOpen: boolean = false;
    component: IIIFComponents.ITreeComponent;
    treeData: IIIFComponents.ITreeComponentData;
    $tree: JQuery;

    constructor($element: JQuery) {
        super($element, true, true);
    }

    create(): void {
        this.setConfig('contentLeftPanel');
        super.create();

        this.$tree = $('<div class="iiif-tree-component"></div>');
        this.$element.append(this.$tree);
    }

    setup(): void {
        var that = this;

        this.component = new IIIFComponents.TreeComponent({
            target: this.$tree[0], 
            data: this.treeData
        });

        // todo: casting as <any> is necessary because IBaseComponent doesn't implement ITinyEmitter
        // it is mixed-in a runtime. figure out how to add .on etc to IBaseComponent without needing
        // to implement it in BaseComponent.

        (<any>this.component).on('treeNodeSelected', function(args) {
            var node = args[0];
            $.publish(Commands.TREE_NODE_SELECTED, [node]);
        });

        (<any>this.component).on('treeNodeMultiSelected', function(args) {
            var node = args[0];
            $.publish(Commands.TREE_NODE_MULTISELECTED, [node]);
        });
    }

    public databind(): void {
        this.component.options.data = this.treeData;
        this.component.set(null); // todo: should be passing options.data
        this.resize();
    }

    public show(): void {
        this.isOpen = true;
        this.$element.show();
    }

    public hide(): void {
        this.isOpen = false;
        this.$element.hide();
    }

    public selectNode(node: Manifold.ITreeNode): void {
        this.component.selectNode(node);
    }

    public deselectCurrentNode(): void {
        this.component.deselectCurrentNode();
    }

    public getNodeById(id: string): ITreeNode {
        return this.component.getNodeById(id);
    }

    resize(): void {
        super.resize();
    }
}