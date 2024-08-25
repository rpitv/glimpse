import {newsText} from "@news/types/schemas/newsText";

export interface DOTWWeather {
	/*
	* The name of the day of the week
	*/
	dayOfTheWeek: newsText<string>
	/*
	* The description accompanying the weather
	*/
	description: newsText<string>
	/*
	* Extra bits of information
	*/
	extra: newsText<string>
	/*
	* The upper limit of the temperature
	*/
	highTemperature: newsText<number>
	/*
	* The size of gif that gets rendered runs which is dependent on weather
	*/
	gifSize: number
	/*
	* The lower limit of the temperature
	*/
	lowTemperature: newsText<number>
	/*
	* The type of weather
	*/
	weather: newsText<"sunny" | "mostly sunny" | "cloudy" | "mostly cloudy" | "rain" | "thunderstorm" | "snowy">
}
