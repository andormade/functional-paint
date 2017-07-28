import {getChannelCount, bytePosition2Coordinates, coordinates2bytePosition,
	forEachPixel, forEachByte} from './utils.js';
import {CHANNEL_RED, CHANNEL_GREEN, CHANNEL_BLUE, CHANNEL_ALPHA,
	RGB, RGBA} from './constants.js';

/**
 * Creates a new empty canvas.
 */
export function createCanvas(
	width: number,
	height: number,
	hasAlphaChannel: boolean = true
): Canvas {
	let channels = hasAlphaChannel ? RGBA : RGB;

	return {
		width           : width,
		height          : height,
		hasAlphaChannel : hasAlphaChannel,
		data            : new Uint8Array(width * height * channels).fill(0x00)
	};
}

/**
 * Creates a new canvas object from an image buffer.
 */
export function createCanvasFromImageBuffer(
	imageBuffer: array,
	width: number,
	height: number = imageBuffer / (width * 4),
	hasAlphaChannel: boolean = true
): Canvas {
	let canvas = createCanvas(width, height, hasAlphaChannel);
	canvas.data = [...imageBuffer];
	return canvas;
}

/**
 * Clones the canvas object.
 */
export function cloneCanvas(canvas: Canvas): Canvas {
	return createCanvasFromImageBuffer(
		canvas.data, canvas.width, canvas.height, canvas.hasAlphaChannel
	);
}

/**
 * Compares two colors.
 */
export function isEqualColor(color1: array, color2: array): boolean {
	return (
		color1[CHANNEL_RED] === color2[CHANNEL_RED] &&
		color1[CHANNEL_GREEN] === color2[CHANNEL_GREEN] &&
		color1[CHANNEL_BLUE] === color2[CHANNEL_BLUE]
	);
}

/**
 * Sets one pixels color on the canvas.
 */
export function drawPixel(
	canvas: Canvas,
	x: number,
	y: number,
	color: array
): Canvas {
	let workingCanvas = cloneCanvas(canvas),
		bytePos = coordinates2bytePosition(canvas, x, y);

	[
		workingCanvas.data[bytePos + CHANNEL_RED],
		workingCanvas.data[bytePos + CHANNEL_GREEN],
		workingCanvas.data[bytePos + CHANNEL_BLUE]
	] = color;

	return workingCanvas;
}

/**
 * Draws a rectangle.
 */
export function drawRect(
	canvas: Canvas,
	x: number,
	y: number,
	width: number,
	height: number,
	color: array
): Canvas {
	let workingCanvas = cloneCanvas(canvas);

	for (let i = x; i < x + width; i++) {
		for (let j = y; j < y + height; j++) {
			let bytePos = coordinates2bytePosition(canvas, i, j);
			[
				workingCanvas.data[bytePos + CHANNEL_RED],
				workingCanvas.data[bytePos + CHANNEL_GREEN],
				workingCanvas.data[bytePos + CHANNEL_BLUE],
				workingCanvas.data[bytePos + CHANNEL_ALPHA]
			] = color;
 		}
	}

	return workingCanvas;
}

/**
 * Draws a canvas on another canvas.
 */
export function drawCanvas(
	destination: Canvas,
	source: Canvas,
	offsetX: number,
	offsetY: number
): Canvas {
	let workingCanvas = cloneCanvas(destination);

	forEachPixel(source, (x, y, bytePos) => {
		if (typeof destination.data[destBytePos] === 'undefined') {
			return;
		}

		let destBytePos = coordinates2bytePosition(x + offsetX, y + offsetY);

		[
			workingCanvas.data[destBytePos + CHANNEL_RED],
			workingCanvas.data[destBytePos + CHANNEL_GREEN],
			workingCanvas.data[destBytePos + CHANNEL_BLUE]
		] = [
			source.data[bytePos + CHANNEL_RED],
			source.data[bytePos + CHANNEL_GREEN],
			source.data[bytePos + CHANNEL_BLUE]
		]

		if (source.hasAlphaChannel && destination.hasAlphaChannel) {
			workingCanvas.data[destBytePos + CHANNEL_ALPHA] =
				source.data[bytePos + CHANNEL_ALPHA];
		}
		else if (!source.hasAlphaChannel && destination.hasAlphaChannel) {
			workingCanvas.data[destBytePos + CHANNEL_ALPHA] = 0xff;
		}
	});

	return workingCanvas;
}

/**
 * Replaces the specified color on the canvas.
 */
export function replaceColor(
	canvas: Canvas,
	replacee: array,
	replacer: array
): Canvas {
	let workingCanvas = cloneCanvas(canvas);

	forEachPixel(canvas, (x, y, bytePos) => {
		if (isEqualColor(getColor(canvas, x, y), replacee)) {
			[
				workingCanvas.data[bytePos + CHANNEL_RED],
				workingCanvas.data[bytePos + CHANNEL_GREEN],
				workingCanvas.data[bytePos + CHANNEL_BLUE]
			] = replacer;
		}
	});

	return workingCanvas;
}

/**
 * Returns with the color of the specified coordinates.
 */
export function getColor(canvas: Canvas, x: number, y: number): array {
	let bytePos = coordinates2bytePosition(canvas, x, y),
		color = [
			canvas.data[bytePos + CHANNEL_RED],
			canvas.data[bytePos + CHANNEL_GREEN],
			canvas.data[bytePos + CHANNEL_BLUE]
		];

	if (canvas.hasAlphaChannel) {
		color[CHANNEL_ALPHA] = canvas.data[bytePos + CHANNEL_ALPHA];
	}

	return color;
}
