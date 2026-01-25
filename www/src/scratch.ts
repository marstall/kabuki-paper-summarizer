// import ArticleContainer from './app/models/article'
//
// const raw = {
//   year: 1986,
//   original_title: "original title ..."
// }
//
// const article = new ArticleContainer(raw)
//
// const proxy = new Proxy(raw, article);
//
// console.log(proxy.year)

// interface Raw {
//
// }
//
// interface RawStreet extends Raw {
//   houses: number,
//   mailboxes: number
// }
//
// const raw_street: RawStreet = {
//   houses: 6,
//   mailboxes: 3
// }
//
// class Base {
//   raw: Raw;
//   constructor(raw:any) {
//     this.raw=raw
//   }
// }
//
// class Street extends Base {
//   raw: RawStreet
//   constructor(raw:RawStreet) {
//     super(raw)
//     this.raw=raw
//   }
// }
//
// const street = new Street(raw_street);
//
// console.log(street.raw.houses)
//
// // ----------------------------------------
// // ----------------------------------------
//
const target = {
  message1: "hello",
  message2: "everyone",
};


class Handler {
  static create() {
    const handler = new Handler()
    return new Proxy(target, {
      get(target, prop, receiver) {
        if (Object.hasOwn(target,prop)) {
          return Reflect.get(target,prop,receiver);
        }
        return (handler as any)[prop]
      }
    });
  }

  message3() {
    return "message3"
  }
};

const handler = Handler.create()

console.log(handler.message1)
// console.log(handler.message2)
console.log(handler.message3())
// console.log(handler.message4)

// console.log(proxy2.message1x)
// console.log(proxy2.message1)
// console.log(proxy2.message2)
// console.log(proxy2.message3)
// console.log(proxy2.message4)
