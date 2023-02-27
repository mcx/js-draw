

export interface ToolbarLocalization {
	fontLabel: string;
	textSize: string;
	touchPanning: string;
	lockRotation: string;
	outlinedRectanglePen: string;
	filledRectanglePen: string;
	linePen: string;
	arrowPen: string;
	image: string;
	inputAltText: string;
	chooseFile: string;
	cancel: string;
	submit: string;
	freehandPen: string;
	pressureSensitiveFreehandPen: string;
	selectObjectType: string;
	colorLabel: string;
	pen: string;
	eraser: string;
	select: string;
	handTool: string;
	thicknessLabel: string;
	resizeImageToSelection: string;
	deleteSelection: string;
	duplicateSelection: string;
	pickColorFromScreen: string;
	clickToPickColorAnnouncement: string;
	reformatSelection: string;
	undo: string;
	redo: string;
	zoom: string;
	resetView: string;
	selectionToolKeyboardShortcuts: string;
	paste: string;
	documentProperties: string;
	backgroundColor: string;
	imageWidthOption: string;
	imageHeightOption: string;
	useGridOption: string;
	toggleOverflow: string,

	errorImageHasZeroSize: string;

	dropdownShown: (toolName: string)=> string;
	dropdownHidden: (toolName: string)=> string;
	zoomLevel: (zoomPercentage: number)=> string;
	colorChangedAnnouncement: (color: string)=> string;
	imageSize: (size: number, units: string)=> string;
	imageLoadError: (message: string)=> string;
}

export const defaultToolbarLocalization: ToolbarLocalization = {
	pen: 'Pen',
	eraser: 'Eraser',
	select: 'Select',
	handTool: 'Pan',
	zoom: 'Zoom',
	image: 'Image',
	reformatSelection: 'Format selection',
	inputAltText: 'Alt text: ',
	chooseFile: 'Choose file: ',
	submit: 'Submit',
	cancel: 'Cancel',
	resetView: 'Reset view',
	thicknessLabel: 'Thickness: ',
	colorLabel: 'Color: ',
	fontLabel: 'Font: ',
	textSize: 'Size: ',
	resizeImageToSelection: 'Resize image to selection',
	deleteSelection: 'Delete selection',
	duplicateSelection: 'Duplicate selection',
	undo: 'Undo',
	redo: 'Redo',
	selectObjectType: 'Object type: ',
	pickColorFromScreen: 'Pick color from screen',
	clickToPickColorAnnouncement: 'Click on the screen to pick a color',
	selectionToolKeyboardShortcuts: 'Selection tool: Use arrow keys to move selected items, lowercase/uppercase ‘i’ and ‘o’ to resize.',
	documentProperties: 'Page',
	backgroundColor: 'Background Color: ',
	imageWidthOption: 'Width: ',
	imageHeightOption: 'Height: ',
	useGridOption: 'Grid: ',
	toggleOverflow: 'More',

	touchPanning: 'Touchscreen panning',

	freehandPen: 'Freehand',
	pressureSensitiveFreehandPen: 'Freehand (pressure sensitive)',
	arrowPen: 'Arrow',
	linePen: 'Line',
	outlinedRectanglePen: 'Outlined rectangle',
	filledRectanglePen: 'Filled rectangle',
	lockRotation: 'Lock rotation',

	paste: 'Paste',

	dropdownShown: (toolName) => `Dropdown for ${toolName} shown`,
	dropdownHidden: (toolName) => `Dropdown for ${toolName} hidden`,
	zoomLevel: (zoomPercent: number) => `Zoom: ${zoomPercent}%`,
	colorChangedAnnouncement: (color: string) => `Color changed to ${color}`,
	imageSize: (size: number, units: string) => `Image size: ${size} ${units}`,

	errorImageHasZeroSize: 'Error: Image has zero size',
	imageLoadError: (message: string)=> `Error loading image: ${message}`,
};
