import type dictEn from "@/dictionaries/en.json";

export type Dictionaries = typeof dictEn;
export type CommonDict = Dictionaries["common"];
export type HomeDict = Dictionaries["home"];
export type AboutDict = Dictionaries["about"];
export type IdeasDict = Dictionaries["ideas"];
export type PhilosophyDict = Dictionaries["philosophy"];
export type ContactDict = Dictionaries["contact"];
