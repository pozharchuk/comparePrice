export class ComparePrices {

    constructor () {

        this._comparedPrices = [];

    }

    normalizeData (arr) {

        if (!Array.isArray(arr)) return [];

        let newArr = [];
        let indStore = {};
        let indCount = 0;

        for (let i = 0; i < arr.length; i++) {
            let supplierName = arr[i].supplier.name.replace(/ /g, '');

            for (let j = 0; j < arr[i].items.length; j++) {
                let curItem = arr[i].items[j];

                if(curItem.parentId + '' in indStore) {
                    newArr[indStore[curItem.parentId]][supplierName] = curItem.price;
                }
                else {
                    let {price, ...rest} = curItem;
                    newArr[indCount] = {
                        ...rest,
                        [supplierName]: price
                    }
                    indStore[rest.parentId] = indCount;
                    ++indCount;
                }

            }
        }
        console.log(newArr);
        return newArr;
    }

    compare (arr) {

        if (!Array.isArray(arr)) return this._comparedPrices;

        const normArr = this.normalizeData(arr);

        this._comparedPrices.length = 0;

        for (let i = 0; i < normArr.length; i++) {
            let {parentId, desc, quantity, ...rest} =  normArr[i];
            let best = {
                itemId: parentId,
                best: '',
                price: 0
            }

            for (let key in rest) {
                if(rest[key] > best.price) {
                    best.best = key;
                    best.price = rest[key];
                }
            }
            this._comparedPrices.push(best);
        }

        return this._comparedPrices;

    }

    get comparedPrices () {

        return this._comparedPrices;

    }
}

const test = new ComparePrices();


const DataToNormalize = [
    {
        id: 123,
        supplier: { id:1001, name:'Supplier A' },
        items: [
            {
                parentId: 1,
                quantity: 5,
                price: 5,
                desc: '1111'
            },
            {
                parentId: 2,
                quantity: 5,
                price: 5,
                desc: '2222'
            },
            {
                parentId: 1,
                quantity: 2,
                price: 10,
                desc: '1111'
            },
        ]
    },
    {
        id: 124,
        supplier: { id:1001, name:'Supplier B' },
        items: [
            {
                parentId: 1,
                quantity: 2,
                price: 6,
                desc: '1111'
            },
            {
                parentId: 2,
                quantity: 5,
                price: 8,
                desc: '2222'
            },
            {
                parentId: 3,
                quantity: 2,
                price: 6,
                desc: '1111'
            },
        ]
    },
    {
        id: 124,
        supplier: { id:1001, name:'Supplier C' },
        items: [
            {
                parentId: 1,
                quantity: 2,
                price: 3,
                desc: '1111'
            },
            {
                parentId: 2,
                quantity: 5,
                price: 12,
                desc: '2222'
            },
            {
                parentId: 3,
                quantity: 2,
                price: 1,
                desc: '1111'
            },
        ]
    }
]

console.log(test.compare(DataToNormalize));