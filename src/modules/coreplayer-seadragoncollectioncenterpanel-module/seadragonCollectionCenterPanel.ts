/// <reference path="../../js/jquery.d.ts" />
/// <reference path="../../js/extensions.d.ts" />

import baseExtension = require("../coreplayer-shared-module/baseExtension");
import baseProvider = require("../coreplayer-shared-module/baseProvider");
import extension = require("../../extensions/coreplayer-seadragon-extension/extension");
import baseCenter = require("../coreplayer-shared-module/seadragonCenterPanel");
import ISeadragonProvider = require("../../extensions/coreplayer-seadragon-extension/iSeadragonProvider");
import utils = require("../../utils");

export class SeadragonCollectionCenterPanel extends baseCenter.SeadragonCenterPanel {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('seadragonCenterPanel');

        super.create();

        // events.
        $.subscribe(baseExtension.BaseExtension.OPEN_MEDIA, (e, uri) => {
            var tileSources = this.provider.getTileSources();

            var that = this;

            if (tileSources.length > 1) {
                that.viewer.addHandler('open', function openHandler() {
                    that.viewer.removeHandler('open', openHandler);

                    tileSources[1].x = that.viewer.world.getItemAt(0).getWorldBounds().x + that.viewer.world.getItemAt(0).getWorldBounds().width;

                    that.viewer.addTiledImage(tileSources[1]);
                });
            }

            this.viewer.open(tileSources[0]);
        });
    }

    createSeadragonViewer(): void {
        OpenSeadragon.DEFAULT_SETTINGS.autoHideControls = true;

        // todo: use compiler flag (when available)
        var prefixUrl = (window.DEBUG)? 'modules/coreplayer-seadragoncollectioncenterpanel-module/img/' : 'themes/' + this.provider.config.options.theme + '/img/coreplayer-seadragoncollectioncenterpanel-module/';

        this.viewer = OpenSeadragon({
            id: "viewer",
            showNavigationControl: true,
            showNavigator: true,
            showRotationControl: true,
            showHomeControl: false,
            showFullPageControl: false,
            defaultZoomLevel: this.options.defaultZoomLevel || 0,
            navigatorPosition: 'BOTTOM_RIGHT',
            prefixUrl: prefixUrl,
            navImages: {
                zoomIn: {
                    REST:   'zoom_in.png',
                    GROUP:  'zoom_in.png',
                    HOVER:  'zoom_in.png',
                    DOWN:   'zoom_in.png'
                },
                zoomOut: {
                    REST:   'zoom_out.png',
                    GROUP:  'zoom_out.png',
                    HOVER:  'zoom_out.png',
                    DOWN:   'zoom_out.png'
                },
                rotateright: {
                    REST:   'rotate_right.png',
                    GROUP:  'rotate_right.png',
                    HOVER:  'rotate_right.png',
                    DOWN:   'rotate_right.png'
                },
                rotateleft: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                },
                next: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                },
                previous: {
                    REST:   'pixel.gif',
                    GROUP:  'pixel.gif',
                    HOVER:  'pixel.gif',
                    DOWN:   'pixel.gif'
                }
            }
        });
    }
}