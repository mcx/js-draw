import SerializableCommand from '../commands/SerializableCommand';
import Editor from '../Editor';
import EditorImage from '../EditorImage';
import LineSegment2 from '../math/LineSegment2';
import Mat33, { Mat33Array } from '../math/Mat33';
import Rect2 from '../math/Rect2';
import { EditorLocalization } from '../localization';
import AbstractRenderer from '../rendering/renderers/AbstractRenderer';
import { ImageComponentLocalization } from './localization';
import UnresolvedSerializableCommand from '../commands/UnresolvedCommand';

export type LoadSaveData = (string[]|Record<symbol, string|number>);
export type LoadSaveDataTable = Record<string, Array<LoadSaveData>>;
export type DeserializeCallback = (data: string)=>AbstractComponent;
type ComponentId = string;

/**
 * A base class for everything that can be added to an {@link EditorImage}.
 */
export default abstract class AbstractComponent {
	// The timestamp (milliseconds) at which the component was
	// last changed (i.e. created/translated).
	// @deprecated
	protected lastChangedTime: number;

	// The bounding box of this component.
	// {@link getBBox}, by default, returns `contentBBox`.
	// This must be set by components.
	protected abstract contentBBox: Rect2;

	private zIndex: number;
	private id: string;

	// Topmost z-index
	private static zIndexCounter: number = 0;

	protected constructor(
		// A unique identifier for the type of component
		private readonly componentKind: string,
		initialZIndex?: number,
	) {
		this.lastChangedTime = (new Date()).getTime();

		if (initialZIndex !== undefined) {
			this.zIndex = initialZIndex;
		} else {
			this.zIndex = AbstractComponent.zIndexCounter++;
		}

		// Create a unique ID.
		this.id = `${new Date().getTime()}-${Math.random()}`;

		if (AbstractComponent.deserializationCallbacks[componentKind] === undefined) {
			throw new Error(`Component ${componentKind} has not been registered using AbstractComponent.registerComponent`);
		}
	}

	// Returns a unique ID for this element.
	// @see { @link EditorImage.lookupElement }
	public getId() {
		return this.id;
	}

	private static deserializationCallbacks: Record<ComponentId, DeserializeCallback|null> = {};

	// Store the deserialization callback (or lack of it) for [componentKind].
	// If components are registered multiple times (as may be done in automated tests),
	// the most recent deserialization callback is used.
	public static registerComponent(
		componentKind: string,
		deserialize: DeserializeCallback|null,
	) {
		this.deserializationCallbacks[componentKind] = deserialize ?? null;
	}

	// Stores data attached by a loader.
	private loadSaveData: LoadSaveDataTable = {};

	/**
	 * Attach data that can be used while exporting the component (e.g. to SVG).
	 * 
	 * This is intended for use by an {@link ImageLoader}.
	 */
	public attachLoadSaveData(key: string, data: LoadSaveData) {
		if (!this.loadSaveData[key]) {
			this.loadSaveData[key] = [];
		}
		this.loadSaveData[key].push(data);
	}

	/** See {@link attachLoadSaveData} */
	public getLoadSaveData(): LoadSaveDataTable {
		return this.loadSaveData;
	}

	public getZIndex(): number {
		return this.zIndex;
	}

	/** @returns the bounding box of this. */
	public getBBox(): Rect2 {
		return this.contentBBox;
	}

	/** Called when this component is added to the given image. */
	public onAddToImage(_image: EditorImage): void { }
	public onRemoveFromImage(): void { }

	public abstract render(canvas: AbstractRenderer, visibleRect?: Rect2): void;

	/** @return true if `lineSegment` intersects this component. */
	public abstract intersects(lineSegment: LineSegment2): boolean;

	/**
	 * @returns true if this component intersects `rect` -- it is entirely contained
	 *  within the rectangle or one of the rectangle's edges intersects this component.
	 */
	public intersectsRect(rect: Rect2): boolean {
		// If this component intersects rect,
		// it is either contained entirely within rect or intersects one of rect's edges.

		// If contained within,
		if (rect.containsRect(this.getBBox())) {
			return true;
		}

		// Calculated bounding boxes can be slightly larger than their actual contents' bounding box.
		// As such, test with more lines than just the rect's edges.
		const testLines = [];
		for (const subregion of rect.divideIntoGrid(2, 2)) {
			testLines.push(...subregion.getEdges());
		}

		return testLines.some(edge => this.intersects(edge));
	}

	// Return null iff this object cannot be safely serialized/deserialized.
	protected abstract serializeToJSON(): any[]|Record<string, any>|number|string|null;

	// Private helper for transformBy: Apply the given transformation to all points of this.
	protected abstract applyTransformation(affineTransfm: Mat33): void;

	// Returns a command that, when applied, transforms this by [affineTransfm] and
	// updates the editor.
	public transformBy(affineTransfm: Mat33): SerializableCommand {
		return new AbstractComponent.TransformElementCommand(affineTransfm, this.getId(), this);
	}

	// Returns a command that updates this component's z-index.
	public setZIndex(newZIndex: number): SerializableCommand {
		return new AbstractComponent.TransformElementCommand(Mat33.identity, this.getId(), this, newZIndex, this.getZIndex());
	}

	// @returns true iff this component can be selected (e.g. by the selection tool.)
	public isSelectable(): boolean {
		return true;
	}

	// @returns true iff this component should be added to the background, rather than the
	// foreground of the image.
	public isBackground(): boolean {
		return false;
	}

	// @returns an approximation of the proportional time it takes to render this component.
	// This is intended to be a rough estimate, but, for example, a stroke with two points sould have
	// a renderingWeight approximately twice that of a stroke with one point.
	public getProportionalRenderingTime(): number {
		return 1;
	}

	private static transformElementCommandId = 'transform-element';

	private static TransformElementCommand = class extends UnresolvedSerializableCommand {
		private targetZIndex: number;

		// Construct a new TransformElementCommand. `component`, while optional, should
		// be provided if available. If not provided, it will be fetched from the editor's
		// document when the command is applied.
		public constructor(
			private affineTransfm: Mat33,
			componentID: string,
			component?: AbstractComponent,
			targetZIndex?: number,
			private origZIndex?: number,
		) {
			super(AbstractComponent.transformElementCommandId, componentID, component);
			this.targetZIndex = targetZIndex ?? AbstractComponent.zIndexCounter++;

			// Ensure that we keep drawing on top even after changing the z-index.
			if (this.targetZIndex >= AbstractComponent.zIndexCounter) {
				AbstractComponent.zIndexCounter = this.targetZIndex + 1;
			}

			if (component && origZIndex === undefined) {
				this.origZIndex = component.getZIndex();
			}
		}

		protected resolveComponent(image: EditorImage): void {
			if (this.component) {
				return;
			}

			super.resolveComponent(image);
			this.origZIndex ??= this.component!.getZIndex();
		}

		private updateTransform(editor: Editor, newTransfm: Mat33) {
			if (!this.component) {
				throw new Error('this.component is undefined or null!');
			}

			// Any parent should have only one direct child.
			const parent = editor.image.findParent(this.component);
			let hadParent = false;
			if (parent) {
				parent.remove();
				hadParent = true;
			}

			this.component.applyTransformation(newTransfm);
			this.component.lastChangedTime = (new Date()).getTime();

			// Add the element back to the document.
			if (hadParent) {
				EditorImage.addElement(this.component).apply(editor);
			}
		}

		public apply(editor: Editor) {
			this.resolveComponent(editor.image);

			this.component!.zIndex = this.targetZIndex;
			this.updateTransform(editor, this.affineTransfm);
			editor.queueRerender();
		}

		public unapply(editor: Editor) {
			this.resolveComponent(editor.image);

			this.component!.zIndex = this.origZIndex!;
			this.updateTransform(editor, this.affineTransfm.inverse());
			editor.queueRerender();
		}

		public description(_editor: Editor, localizationTable: EditorLocalization) {
			return localizationTable.transformedElements(1);
		}

		static {
			SerializableCommand.register(AbstractComponent.transformElementCommandId, (json: any, editor: Editor) => {
				const elem = editor.image.lookupElement(json.id) ?? undefined;
				const transform = new Mat33(...(json.transfm as Mat33Array));
				const targetZIndex = json.targetZIndex;
				const origZIndex = json.origZIndex ?? undefined;

				return new AbstractComponent.TransformElementCommand(
					transform,
					json.id,
					elem,
					targetZIndex,
					origZIndex,
				);
			});
		}

		protected serializeToJSON() {
			return {
				id: this.componentID,
				transfm: this.affineTransfm.toArray(),
				targetZIndex: this.targetZIndex,
				origZIndex: this.origZIndex,
			};
		}
	};

	/**
	 * @return a description that could be read by a screen reader
	 *     (e.g. when adding/erasing the component)
	 */
	public abstract description(localizationTable: ImageComponentLocalization): string;

	// Component-specific implementation of {@link clone}.
	protected abstract createClone(): AbstractComponent;

	// Returns a copy of this component.
	public clone() {
		const clone = this.createClone();

		for (const attachmentKey in this.loadSaveData) {
			for (const val of this.loadSaveData[attachmentKey]) {
				clone.attachLoadSaveData(attachmentKey, val);
			}
		}

		return clone;
	}

	// Convert the component to an object that can be passed to
	// `JSON.stringify`.
	//
	// Do not rely on the output of this function to take a particular form —
	// this function's output can change form without a major version increase.
	public serialize() {
		const data = this.serializeToJSON();

		if (data === null) {
			throw new Error(`${this} cannot be serialized.`);
		}

		return {
			name: this.componentKind,
			zIndex: this.zIndex,
			id: this.id,
			loadSaveData: this.loadSaveData,
			data,
		};
	}

	// Returns true if `data` is not deserializable. May return false even if [data]
	// is not deserializable.
	private static isNotDeserializable(json: any|string) {
		if (typeof json === 'string') {
			json = JSON.parse(json);
		}

		if (typeof json !== 'object') {
			return true;
		}

		if (!this.deserializationCallbacks[json?.name]) {
			return true;
		}

		if (!json.data) {
			return true;
		}

		return false;
	}

	// Convert a string or an object produced by `JSON.parse` into an `AbstractComponent`.
	public static deserialize(json: string|any): AbstractComponent {
		if (typeof json === 'string') {
			json = JSON.parse(json);
		}

		if (AbstractComponent.isNotDeserializable(json)) {
			throw new Error(`Element with data ${json} cannot be deserialized.`);
		}

		const instance = this.deserializationCallbacks[json.name]!(json.data);
		instance.zIndex = json.zIndex;
		instance.id = json.id;
		
		// TODO: What should we do with json.loadSaveData?
		//       If we attach it to [instance], we create a potential security risk — loadSaveData
		//       is often used to store unrecognised attributes so they can be preserved on output.
		//       ...but what if we're deserializing data sent across the network?

		return instance;
	}
}
