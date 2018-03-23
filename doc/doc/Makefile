ALL: builddir build/conversion-fixedpre.pl build/conversion-percentage.pl run

builddir: | build

build:
	mkdir -p build

build/conversion-fixedpre.pl: conversion.prolog fixedpre.pl~
	cat $^ > $@
	
build/conversion-percentage.pl: conversion.prolog percentage.pl~
	cat $^ > $@
	
run:
	swipl -s build/conversion-percentage.pl -t deal -q -tty | perl -nle 'print if not $$seen{$$_}++'
	
