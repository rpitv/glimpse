import Text from "./newsText";

export interface NewsImage {
	/*
	* Whether the image is centered on the x-axis or not.
	*/
	centerX: boolean;
	/*
	* Whether the image is centered on the y-axis or not.
	*/
	centerY: boolean;
	/*
	* The size of the image.
	*/
	size: number;
	/*
	* The visibility of the image.
	*/
	show: boolean;
	/*
	* The link of the image.
	*/
	source: string;
	/*
	* The X position of the image. The bigger the X value, the more right it goes.
	*/
	x: number;
	/*
	* The Y position of the image. The bigger the Y value, the more up it goes.
	*/
	y: number;
}
