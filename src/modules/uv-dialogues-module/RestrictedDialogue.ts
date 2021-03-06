import {BaseEvents} from "../uv-shared-module/BaseEvents";
import {Dialogue} from "../uv-shared-module/Dialogue";

export class RestrictedDialogue extends Dialogue {

    $cancelButton: JQuery;
    $message: JQuery;
    $nextVisibleButton: JQuery;
    $title: JQuery;
    acceptCallback: any;
    isAccepted: boolean;
    resource: Manifesto.IExternalResource;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('restrictedDialogue');

        super.create();

        this.openCommand = BaseEvents.SHOW_RESTRICTED_DIALOGUE;
        this.closeCommand = BaseEvents.HIDE_RESTRICTED_DIALOGUE;

        this.component.subscribe(this.openCommand, (e: any) => {
            this.acceptCallback = e.acceptCallback;
            this.options = e.options;
            this.resource = e.resource;
            this.open();
        });

        this.component.subscribe(this.closeCommand, () => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$content.append('\
            <div>\
                <p class="message scroll"></p>\
                <div class="buttons">\
                    <a class="cancel btn btn-primary" href="#" target="_parent"></a>\
                </div>\
            </div>'
        );

        this.$message = this.$content.find('.message');
        this.$message.targetBlank();

        // todo: revisit?
        //this.$nextVisibleButton = this.$content.find('.nextvisible');
        //this.$nextVisibleButton.text(this.content.nextVisibleItem);

        this.$cancelButton = this.$content.find('.cancel');
        this.$cancelButton.text(this.content.cancel);

        this.$element.hide();

        this.$cancelButton.on('click', (e) => {
            e.preventDefault();
            this.close();
        });
    }

    open(): void {
        super.open();

        this.isAccepted = false;

        let message: string = "";

        if (this.resource.restrictedService) {
            this.$title.text(this.resource.restrictedService.getProperty('label'));
            message = this.resource.restrictedService.getProperty('description');
        }

        this.$message.html(message);
        this.$message.targetBlank();

        this.$message.find('a').on('click', function() {
            var url: string = $(this).attr('href');
            this.component.publish(BaseEvents.EXTERNAL_LINK_CLICKED, url);
        });

        this.resize();
    }

    close(): void {
        super.close();

        if (!this.isAccepted && this.acceptCallback){
            this.isAccepted = true;
            this.acceptCallback();
        }
    }

    resize(): void {
        super.resize();
    }
}