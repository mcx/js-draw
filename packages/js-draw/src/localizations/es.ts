import { defaultEditorLocalization, EditorLocalization } from '../localization';

// A partial Spanish localization, created with /scripts/markdownTranslationFormToTs.ts
const localization: EditorLocalization = {
	...defaultEditorLocalization,
	pen: 'Lapiz',
	eraser: 'Borrador',
	select: 'Selecciona',
	handTool: 'Mover',
	image: 'Imagen',
	chooseFile: 'Seleccionar archivo',
	cancel: 'Cancelar',
	resetView: 'Reiniciar vista',
	thicknessLabel: 'Tamaño',
	fontLabel: 'Fuente:',
	textSize: 'Tamaño',
	resizeImageToSelection: 'Redimensionar la imagen a lo que está seleccionado',
	deleteSelection: 'Borra la selección',
	duplicateSelection: 'Duplica la selección',
	exit: 'Salir',
	save: 'Guardar',
	undo: 'Deshace',
	redo: 'Rehace',
	selectPenTip: 'Punta',
	selectShape: 'Forma',
	pickColorFromScreen: 'Selecciona un color de la pantalla',
	clickToPickColorAnnouncement: 'Haga un clic en la pantalla para seleccionar un color',
	documentProperties: 'Fondo',
	backgroundColor: 'Color de fondo',
	imageWidthOption: 'Ancho',
	imageHeightOption: 'Alto',
	toggleOverflow: 'Más',
	touchPanning: 'Mover la pantalla con un dedo',
	roundedTipPen: 'Lapiz Redondeado',
	arrowPen: 'Flecha',
	linePen: 'Línea',
	outlinedRectanglePen: 'Rectángulo delineado',
	filledRectanglePen: 'Rectángulo sin borde',
	lockRotation: 'Bloquea rotación',
	paste: 'Pegar',
	closeSidebar: (toolName) => `Close sidebar for ${toolName}`,
	dropdownShown: (toolName) => `Menú por ${toolName} es visible`,
	dropdownHidden: (toolName) => { return `Menú por ${toolName} fue ocultado`; },
	zoomLevel: (zoomPercent) => `Zoom: ${zoomPercent}%`,
	colorChangedAnnouncement: (color) => { return `Color fue cambiado a ${color}`; },
	imageSize: (size, units) => `Tamaño del imagen: ${size} ${units}`,
	imageLoadError: (message) => `Error cargando imagen: ${message}`,
	penTool: (penId) => { return `Lapiz ${penId}`; },
	selectionTool: 'Selecciona',
	eraserTool: 'Borrador',
	touchPanTool: 'Instrumento de mover la pantalla con un dedo',
	pipetteTool: 'Seleccione un color de la pantalla',
	keyboardPanZoom: 'Mover la pantalla con el teclado',
	textTool: 'Texto',
	enterTextToInsert: 'Entra texto',
	findLabel: 'Buscar',
	toNextMatch: 'Próxima',
	closeDialog: 'Cerrar',
	focusedFoundText: (matchIdx, totalMatches) => `Viewing match ${matchIdx} of ${totalMatches}`,
	anyDevicePanning: 'Mover la pantalla con todo dispotivo',
	copied: (count, description) => `Copied ${count} ${description}`,
	pasted: (count, description) => `Pasted ${count} ${description}`,
	toolEnabledAnnouncement: (toolName) => `${toolName} enabled`,
	toolDisabledAnnouncement: (toolName) => `${toolName} disabled`,
	transformedElements: (elemCount) => `Transformed ${elemCount} element${elemCount === 1 ? '' : 's'}`,
	resizeOutputCommand: (newSize) => `Resized image to ${newSize.w}x${newSize.h}`,
	addElementAction: (componentDescription) => `Added ${componentDescription}`,
	eraseAction: (componentDescription, numElems) => `Erased ${numElems} ${componentDescription}`,
	duplicateAction: (componentDescription, numElems) => `Duplicated ${numElems} ${componentDescription}`,
	unionOf: (actionDescription, actionCount) => `Union: ${actionCount} ${actionDescription}`,
	inverseOf: (actionDescription) => `Inverse of ${actionDescription}`,
	rotatedBy: (degrees) => `Rotated by ${Math.abs(degrees)} degrees ${degrees < 0 ? 'clockwise' : 'counter-clockwise'}`,
	selectedElements: (count) => `Selected ${count} element${count === 1 ? '' : 's'}`,
	filledBackgroundWithColor: (color) => `Filled background (${color})`,
	text: (text) => `Text object: ${text}`,
	imageNode: (label) => `Image: ${label}`,
	restyledElement: (elementDescription) => `Restyled ${elementDescription}`,
	pathNodeCount: (count) => `There are ${count} visible path objects.`,
	textNodeCount: (count) => `There are ${count} visible text nodes.`,
	imageNodeCount: (nodeCount) => `There are ${nodeCount} visible image nodes.`,
	textNode: (content) => `Text: ${content}`,
	rerenderAsText: 'Redibuja la pantalla al texto',
	loading: (percentage) => `Cargando: ${percentage}%...`,
	imageEditor: 'Editor de dibujos',
	doneLoading: 'El cargado terminó',
	undoAnnouncement: (commandDescription) => `${commandDescription} fue deshecho`,
	redoAnnouncement: (commandDescription) => `${commandDescription} fue rehecho`,
};

export default localization;