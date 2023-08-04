
import { IconProvider, IconElemType, TextRenderingStyle, PenStyle } from 'js-draw';

import README from './icons/README.md';
import ExpandMore from './icons/ExpandMore.svg';
import Undo from './icons/Undo.svg';
import Redo from './icons/Redo.svg';
import InkEraser from './icons/InkEraser.svg';
import ArrowSelectorTool from './icons/ArrowSelectorTool.svg';
import PanTool from './icons/PanTool.svg';
import TouchApp from './icons/TouchApp.svg';
import ScreenLockRotation from './icons/ScreenLockRotation.svg';
import Imagesmode from './icons/Imagesmode.svg';
import Title from './icons/Title.svg';
import Resize from './icons/Resize.svg';
import Delete from './icons/Delete.svg';
import ContentCopy from './icons/ContentCopy.svg';
import EditDocument from './icons/EditDocument.svg';
import Check from './icons/Check.svg';
import InkHighlighter from './icons/InkHighlighter.svg';
import Edit from './icons/Edit.svg';


const icon = (data: string) => {
	const icon = document.createElement('div');
	icon.innerHTML = data;
	return icon.childNodes[0] as SVGElement;
};

class MaterialIconProvider extends IconProvider {
	public override makeUndoIcon(): IconElemType {
		return icon(Undo);
	}
	public override makeRedoIcon(): IconElemType {
		return icon(Redo);
	}
	public override makeDropdownIcon(): IconElemType {
		return icon(ExpandMore);
	}
	public override makeEraserIcon(_eraserSize?: number): IconElemType {
		return icon(InkEraser);
	}
	public override makeSelectionIcon(): IconElemType {
		return icon(ArrowSelectorTool);
	}
	public override makeHandToolIcon(): IconElemType {
		return icon(PanTool);
	}
	public override makeTouchPanningIcon(): IconElemType {
		return icon(TouchApp);
	}
	// makeAllDevicePanningIcon(): IconElemType;
	// makeZoomIcon(): IconElemType;
	public override makeRotationLockIcon(): IconElemType {
		return icon(ScreenLockRotation);
	}
	public override makeInsertImageIcon(): IconElemType {
		return icon(Imagesmode);
	}
	public override makeTextIcon(_textStyle: TextRenderingStyle): IconElemType {
		return icon(Title);
	}
	public override makePenIcon(style: PenStyle): IconElemType {
		const svg = icon(this.isRoundedTipPen(style) ? Edit : InkHighlighter);

		svg.setAttribute('viewBox', '0 -880 960 1000');

		const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		line.setAttribute('d', `
			M110,-25 L850,-25
		`);
		line.style.stroke = style.color.toHexString();
		line.style.strokeWidth = `${Math.sqrt(style.thickness) * 20}`;

		if (!this.isRoundedTipPen(style)) {
			line.style.strokeLinecap = 'square';
		}

		svg.insertAdjacentElement('afterbegin', line);

		// Add a grid background to make transparency visible
		if (style.color.a < 1) {
			const checkerboard = this.makeCheckerboardPattern();
			const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
			defs.innerHTML = checkerboard.patternDef;
			svg.appendChild(defs);

			const lineBackground = line.cloneNode() as SVGPathElement;
			lineBackground.style.stroke = checkerboard.patternRef;

			svg.insertAdjacentElement('afterbegin', lineBackground);
		}

		return svg;
	}
	// makeIconFromFactory(pen: Pen, factory: ComponentBuilderFactory, includeTransparencyGrid?: boolean): IconElemType;
	// makePipetteIcon(color?: Color4): IconElemType;
	// makeFormatSelectionIcon(): IconElemType;
	public override makeResizeImageToSelectionIcon(): IconElemType {
		return icon(Resize);
	}
	public override makeDuplicateSelectionIcon(): IconElemType {
		return icon(ContentCopy);
	}
	public override makeDeleteSelectionIcon(): IconElemType {
		return icon(Delete);
	}
	public override makeSaveIcon(): IconElemType {
		return icon(Check);
	}
	public override makeConfigureDocumentIcon(): IconElemType {
		return icon(EditDocument);
	}
	// makeOverflowIcon(): IconElemType;

	public override licenseInfo() {
		return README;
	}
}

export { MaterialIconProvider };
export default MaterialIconProvider;