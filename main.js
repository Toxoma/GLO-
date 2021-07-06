import data from './db_cities.js';
console.log('data: ', data.RU);

document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    const input = document.getElementById('select-cities'),
        label = document.querySelector('.label'),
        dropdownDefault = document.querySelector('.dropdown-lists__list--default'),
        dropdownAuto = document.querySelector('.dropdown-lists__list--autocomplete'),
        dropdownSelect = document.querySelector('.dropdown-lists__list--select'),
        closeButton = document.querySelector('.close-button'),
        linkButton = document.querySelector('.button'),
        span = document.querySelector('.focus-border');



    const closeList = (list) => {
        list.classList.remove('active');
    };

    const openList = (list) => {
        list.classList.add('active');
    };

    const returnInput = () => {
        label.textContent = 'Страна или город';
        input.value = '';
    };

    const listCol = (list) => {
        list.insertAdjacentHTML('beforeend', `
        <div class="dropdown-lists__col"></div>
        `);
    };

    const clearListCol = (list) => {
        const defaultCol = list.querySelector('.dropdown-lists__col');
        if (defaultCol) {
            list.textContent = '';
        }
    };

    const countryBlock = (country, list) => {
        const defaultCol = list.querySelector('.dropdown-lists__col');
        defaultCol.insertAdjacentHTML('beforeend', `
        <div id="${country.country}" class="dropdown-lists__countryBlock">
                <div class="dropdown-lists__total-line">
                  <div class="dropdown-lists__country">${country.country}</div>
                  <div class="dropdown-lists__count">${country.count}</div>
                </div>
              </div>
        `);
    };

    const countryBlockItems = (arr, list) => {
        arr.forEach(town => {
            list.insertAdjacentHTML('beforeend', `
                <div class="dropdown-lists__line">
                <div class="dropdown-lists__city dropdown-lists__city--ip">${town.name}</div>
                <div class="dropdown-lists__count">${town.count}</div>
              </div>
            `);
        });
    };

    const errorLog = (value) => {
        if (!document.querySelector('.errorInput')) {
            span.insertAdjacentHTML('afterend', `
            <p class='errorInput'>${value}</p>
            `);
        }
    };
    const clearErrorInput = () => {
        const errorInput = document.querySelector('.errorInput');
        if (errorInput) {
            errorInput.remove();
        }
    };

    //вывод содержимого dropdownAuto
    const autoBlockItems = (value) => {
        if (!value) {
            closeList(dropdownAuto);
            closeList(dropdownSelect);
            openList(dropdownDefault);
            return;
        }

        const str = new RegExp(value, 'i');
        const cities = [];

        data.RU.forEach(arr => {
            arr.cities.forEach(city => {
                if (str.test(city.name)) {
                    cities.push(city);
                }
            });
        });

        if (cities.length === 0) {
            errorLog("Ничего не найдено.");
            return;
        }

        clearErrorInput();


        dropdownAuto.querySelector('.dropdown-lists__col').insertAdjacentHTML('beforeend', `
                <div class="dropdown-lists__countryBlock"></p>
            `);

        cities.forEach(city => {
            dropdownAuto.querySelector('.dropdown-lists__col').insertAdjacentHTML('beforeend', `
                <div class="dropdown-lists__line">
                  <div class="dropdown-lists__city">${city.name}</div>
                  <div class="dropdown-lists__count">${city.count}</div>
                </div>
            `);
        });

    };

    closeButton.addEventListener('click',()=>{
        closeList(dropdownDefault);
        closeList(dropdownAuto);
        closeList(dropdownSelect);
        returnInput();
        clearErrorInput();
    });

    const resetBtn = ()=>{
        if (input.value) {
            closeButton.style.display = 'block';
        }else{
            clearLink();
            closeButton.style.display = 'none';
        }
    };


    //отображение selectList
    const openTown = (e) => {
        const target = e.target.closest('.dropdown-lists__countryBlock');
        label.textContent = target.id;
        input.textContent = target.id;
        closeList(dropdownDefault);
        openList(dropdownSelect);

        const country = data.RU.find(item => item.country === target.id);
        clearListCol(dropdownSelect);
        listCol(dropdownSelect);
        countryBlock(country, dropdownSelect);
        countryBlockItems(country.cities, dropdownSelect);
        dropdownSelect.querySelector('.dropdown-lists__total-line').addEventListener('click', () => {
            returnInput();
            closeList(dropdownSelect);
            openList(dropdownDefault);
        });
    };

    const clearLink = ()=>{
        linkButton.href = '#';
        linkButton.classList.add('block');
    };

    const SelectedEvent = () => {
        document.addEventListener('click', (e) => {
            //определение элемента
            const findTarget = (one, two) => {
                return one.querySelector(`${two}`);
            };

            //вставка в input
            const insert = (value) => {
                input.value = value;
                label.textContent = value;
            };

            const searchLink = (town)=>{
                let link;
                data.RU.forEach(country => {
                    country.cities.find(city => {
                        if (city.name === town) {
                           console.log(city);
                           link = city.link;
                        }
                    });
                });
                return link;
            };
            const insertLink = (link)=>{
                linkButton.href = link;
                linkButton.classList.remove('block');
            };

            if (e.target.closest('.dropdown-lists__total-line')) {
                const target = findTarget(
                    e.target.closest('.dropdown-lists__total-line'),
                    '.dropdown-lists__country');
                
                clearLink();
                insert(target.textContent);
            }

            if (e.target.closest('.dropdown-lists__line')) {
                const target = findTarget(
                    e.target.closest('.dropdown-lists__line'),
                    '.dropdown-lists__city');

                insert(target.textContent);

                //поиск ссылки
               const link = searchLink(target.textContent);
                //вставка ссылки
                insertLink(link);
            }
            resetBtn();
        });
        // const list = document.querySelector('.dropdown-lists__line');

        // dropdownTowns.forEach(town => {
        //     town.addEventListener('click', (e) => {
        //         console.log(e);
        //     });
        // });
    };

    // формирование dropdown-lists__col
    listCol(dropdownDefault);

    //отображение defaul \ сохдание блоков 3х стран
    data.RU.forEach(country => {
        //получение 3х топ городов
        const reducer = (accumulator, currentValue) => {
            if (accumulator.length < 3) {
                accumulator.push(currentValue);
            } else {
                const values = [];
                accumulator.forEach(item => {
                    values.push(item.count);
                });

                const min = Math.min(...values),
                    key = Object.keys(accumulator).find(key => +accumulator[key].count === +min);

                if (currentValue.count > min) {
                    accumulator[key] = currentValue;
                }
            }

            return accumulator;
        };
        const topTowns = country.cities.reduce(reducer, []);


        // формирование defaultList
        countryBlock(country, dropdownDefault);

        //сортировка topTowns
        const sortArray = (arr) => {
            return arr.sort(function (a, b) {
                return b.count - a.count;
            });
        };

        //содержимое dropdown-lists__countryBlock
        const list = document.getElementById(country.country);
        countryBlockItems(sortArray(topTowns), list);

        //event на страны
        const dropdownCountries = document.querySelectorAll('.dropdown-lists__total-line');
        dropdownCountries.forEach(item => item.addEventListener('click', openTown));

    });

    //event на города через body
    SelectedEvent(dropdownDefault);


    //открытие при фокусе
    input.addEventListener('focus', () => {
        closeList(dropdownAuto);
        closeList(dropdownSelect);
        openList(dropdownDefault);
    });

    //ввод открытие dropdownAuto
    input.addEventListener('input', (e) => {
        const target = e.target;
        closeList(dropdownDefault);
        closeList(dropdownSelect);
        clearListCol(dropdownAuto);
        openList(dropdownAuto);
        listCol(dropdownAuto);
        autoBlockItems(target.value);
        resetBtn();
    });

    // linkButton.addEventListener('click')



});