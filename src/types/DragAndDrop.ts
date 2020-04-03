/**
 * Draggable interface for making a thing draggable
 */
export interface Draggable {
    dragStartHandler(event: DragEvent): void
}

/**
 * Drag target for making some component a drag target
 */
export interface DragTarget {
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}
