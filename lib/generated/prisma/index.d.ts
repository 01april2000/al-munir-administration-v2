
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Santri
 * 
 */
export type Santri = $Result.DefaultSelection<Prisma.$SantriPayload>
/**
 * Model Tagihan
 * 
 */
export type Tagihan = $Result.DefaultSelection<Prisma.$TagihanPayload>
/**
 * Model Transaksi
 * 
 */
export type Transaksi = $Result.DefaultSelection<Prisma.$TransaksiPayload>
/**
 * Model MidtransTransaction
 * 
 */
export type MidtransTransaction = $Result.DefaultSelection<Prisma.$MidtransTransactionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  BENDAHARA_SMK: 'BENDAHARA_SMK',
  BENDAHARA_SMP: 'BENDAHARA_SMP',
  BENDAHARA_PONDOK: 'BENDAHARA_PONDOK',
  SANTRI: 'SANTRI'
};

export type Role = (typeof Role)[keyof typeof Role]


export const JenisTagihan: {
  SPP: 'SPP',
  SYAHRIAH: 'SYAHRIAH'
};

export type JenisTagihan = (typeof JenisTagihan)[keyof typeof JenisTagihan]


export const StatusTagihan: {
  BELUM_LUNAS: 'BELUM_LUNAS',
  LUNAS: 'LUNAS',
  OVERDUE: 'OVERDUE'
};

export type StatusTagihan = (typeof StatusTagihan)[keyof typeof StatusTagihan]


export const JenisTransaksi: {
  SPP: 'SPP',
  SYAHRIAH: 'SYAHRIAH',
  UANG_SAKU: 'UANG_SAKU',
  LAUNDRY: 'LAUNDRY',
  UJIAN: 'UJIAN',
  PKL: 'PKL',
  LKS: 'LKS',
  BUKU_PENDAMPING: 'BUKU_PENDAMPING',
  TKA: 'TKA'
};

export type JenisTransaksi = (typeof JenisTransaksi)[keyof typeof JenisTransaksi]


export const StatusTransaksi: {
  LUNAS: 'LUNAS',
  PENDING: 'PENDING',
  BELUM_BAYAR: 'BELUM_BAYAR',
  DITOLAK: 'DITOLAK'
};

export type StatusTransaksi = (typeof StatusTransaksi)[keyof typeof StatusTransaksi]


export const StatusUangSaku: {
  DITAMBAH: 'DITAMBAH',
  DIAMBIL: 'DIAMBIL'
};

export type StatusUangSaku = (typeof StatusUangSaku)[keyof typeof StatusUangSaku]


export const JenisBeasiswa: {
  FULL: 'FULL',
  SYAHRIAH: 'SYAHRIAH',
  SPP: 'SPP',
  UANG_SAKU: 'UANG_SAKU'
};

export type JenisBeasiswa = (typeof JenisBeasiswa)[keyof typeof JenisBeasiswa]


export const JenisSantri: {
  SMK: 'SMK',
  SMP: 'SMP',
  PONDOK: 'PONDOK'
};

export type JenisSantri = (typeof JenisSantri)[keyof typeof JenisSantri]


export const PeriodePembayaran: {
  BULANAN: 'BULANAN',
  TAHUNAN: 'TAHUNAN'
};

export type PeriodePembayaran = (typeof PeriodePembayaran)[keyof typeof PeriodePembayaran]


export const StatusSantri: {
  AKTIF: 'AKTIF',
  NON_AKTIF: 'NON_AKTIF',
  LULUS: 'LULUS',
  KELUAR: 'KELUAR'
};

export type StatusSantri = (typeof StatusSantri)[keyof typeof StatusSantri]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type JenisTagihan = $Enums.JenisTagihan

export const JenisTagihan: typeof $Enums.JenisTagihan

export type StatusTagihan = $Enums.StatusTagihan

export const StatusTagihan: typeof $Enums.StatusTagihan

export type JenisTransaksi = $Enums.JenisTransaksi

export const JenisTransaksi: typeof $Enums.JenisTransaksi

export type StatusTransaksi = $Enums.StatusTransaksi

export const StatusTransaksi: typeof $Enums.StatusTransaksi

export type StatusUangSaku = $Enums.StatusUangSaku

export const StatusUangSaku: typeof $Enums.StatusUangSaku

export type JenisBeasiswa = $Enums.JenisBeasiswa

export const JenisBeasiswa: typeof $Enums.JenisBeasiswa

export type JenisSantri = $Enums.JenisSantri

export const JenisSantri: typeof $Enums.JenisSantri

export type PeriodePembayaran = $Enums.PeriodePembayaran

export const PeriodePembayaran: typeof $Enums.PeriodePembayaran

export type StatusSantri = $Enums.StatusSantri

export const StatusSantri: typeof $Enums.StatusSantri

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.santri`: Exposes CRUD operations for the **Santri** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Santris
    * const santris = await prisma.santri.findMany()
    * ```
    */
  get santri(): Prisma.SantriDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tagihan`: Exposes CRUD operations for the **Tagihan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tagihans
    * const tagihans = await prisma.tagihan.findMany()
    * ```
    */
  get tagihan(): Prisma.TagihanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaksi`: Exposes CRUD operations for the **Transaksi** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transaksis
    * const transaksis = await prisma.transaksi.findMany()
    * ```
    */
  get transaksi(): Prisma.TransaksiDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.midtransTransaction`: Exposes CRUD operations for the **MidtransTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MidtransTransactions
    * const midtransTransactions = await prisma.midtransTransaction.findMany()
    * ```
    */
  get midtransTransaction(): Prisma.MidtransTransactionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    Santri: 'Santri',
    Tagihan: 'Tagihan',
    Transaksi: 'Transaksi',
    MidtransTransaction: 'MidtransTransaction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "santri" | "tagihan" | "transaksi" | "midtransTransaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Santri: {
        payload: Prisma.$SantriPayload<ExtArgs>
        fields: Prisma.SantriFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SantriFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SantriFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          findFirst: {
            args: Prisma.SantriFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SantriFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          findMany: {
            args: Prisma.SantriFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>[]
          }
          create: {
            args: Prisma.SantriCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          createMany: {
            args: Prisma.SantriCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SantriCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>[]
          }
          delete: {
            args: Prisma.SantriDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          update: {
            args: Prisma.SantriUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          deleteMany: {
            args: Prisma.SantriDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SantriUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SantriUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>[]
          }
          upsert: {
            args: Prisma.SantriUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SantriPayload>
          }
          aggregate: {
            args: Prisma.SantriAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSantri>
          }
          groupBy: {
            args: Prisma.SantriGroupByArgs<ExtArgs>
            result: $Utils.Optional<SantriGroupByOutputType>[]
          }
          count: {
            args: Prisma.SantriCountArgs<ExtArgs>
            result: $Utils.Optional<SantriCountAggregateOutputType> | number
          }
        }
      }
      Tagihan: {
        payload: Prisma.$TagihanPayload<ExtArgs>
        fields: Prisma.TagihanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagihanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagihanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          findFirst: {
            args: Prisma.TagihanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagihanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          findMany: {
            args: Prisma.TagihanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>[]
          }
          create: {
            args: Prisma.TagihanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          createMany: {
            args: Prisma.TagihanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagihanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>[]
          }
          delete: {
            args: Prisma.TagihanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          update: {
            args: Prisma.TagihanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          deleteMany: {
            args: Prisma.TagihanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagihanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagihanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>[]
          }
          upsert: {
            args: Prisma.TagihanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagihanPayload>
          }
          aggregate: {
            args: Prisma.TagihanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTagihan>
          }
          groupBy: {
            args: Prisma.TagihanGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagihanGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagihanCountArgs<ExtArgs>
            result: $Utils.Optional<TagihanCountAggregateOutputType> | number
          }
        }
      }
      Transaksi: {
        payload: Prisma.$TransaksiPayload<ExtArgs>
        fields: Prisma.TransaksiFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransaksiFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransaksiFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          findFirst: {
            args: Prisma.TransaksiFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransaksiFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          findMany: {
            args: Prisma.TransaksiFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>[]
          }
          create: {
            args: Prisma.TransaksiCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          createMany: {
            args: Prisma.TransaksiCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransaksiCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>[]
          }
          delete: {
            args: Prisma.TransaksiDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          update: {
            args: Prisma.TransaksiUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          deleteMany: {
            args: Prisma.TransaksiDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransaksiUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransaksiUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>[]
          }
          upsert: {
            args: Prisma.TransaksiUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaksiPayload>
          }
          aggregate: {
            args: Prisma.TransaksiAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaksi>
          }
          groupBy: {
            args: Prisma.TransaksiGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransaksiGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransaksiCountArgs<ExtArgs>
            result: $Utils.Optional<TransaksiCountAggregateOutputType> | number
          }
        }
      }
      MidtransTransaction: {
        payload: Prisma.$MidtransTransactionPayload<ExtArgs>
        fields: Prisma.MidtransTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MidtransTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MidtransTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          findFirst: {
            args: Prisma.MidtransTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MidtransTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          findMany: {
            args: Prisma.MidtransTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>[]
          }
          create: {
            args: Prisma.MidtransTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          createMany: {
            args: Prisma.MidtransTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MidtransTransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>[]
          }
          delete: {
            args: Prisma.MidtransTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          update: {
            args: Prisma.MidtransTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          deleteMany: {
            args: Prisma.MidtransTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MidtransTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MidtransTransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>[]
          }
          upsert: {
            args: Prisma.MidtransTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MidtransTransactionPayload>
          }
          aggregate: {
            args: Prisma.MidtransTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMidtransTransaction>
          }
          groupBy: {
            args: Prisma.MidtransTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<MidtransTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.MidtransTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<MidtransTransactionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    santri?: SantriOmit
    tagihan?: TagihanOmit
    transaksi?: TransaksiOmit
    midtransTransaction?: MidtransTransactionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }


  /**
   * Count Type SantriCountOutputType
   */

  export type SantriCountOutputType = {
    transaksi: number
    tagihan: number
  }

  export type SantriCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | SantriCountOutputTypeCountTransaksiArgs
    tagihan?: boolean | SantriCountOutputTypeCountTagihanArgs
  }

  // Custom InputTypes
  /**
   * SantriCountOutputType without action
   */
  export type SantriCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SantriCountOutputType
     */
    select?: SantriCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SantriCountOutputType without action
   */
  export type SantriCountOutputTypeCountTransaksiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiWhereInput
  }

  /**
   * SantriCountOutputType without action
   */
  export type SantriCountOutputTypeCountTagihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagihanWhereInput
  }


  /**
   * Count Type TransaksiCountOutputType
   */

  export type TransaksiCountOutputType = {
    midtransTransactions: number
    tagihan: number
  }

  export type TransaksiCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    midtransTransactions?: boolean | TransaksiCountOutputTypeCountMidtransTransactionsArgs
    tagihan?: boolean | TransaksiCountOutputTypeCountTagihanArgs
  }

  // Custom InputTypes
  /**
   * TransaksiCountOutputType without action
   */
  export type TransaksiCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TransaksiCountOutputType
     */
    select?: TransaksiCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TransaksiCountOutputType without action
   */
  export type TransaksiCountOutputTypeCountMidtransTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MidtransTransactionWhereInput
  }

  /**
   * TransaksiCountOutputType without action
   */
  export type TransaksiCountOutputTypeCountTagihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagihanWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: $Enums.Role | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    role: $Enums.Role | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    role: number
    banned: number
    banReason: number
    banExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null
    role: $Enums.Role
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    santri?: boolean | User$santriArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "role" | "banned" | "banReason" | "banExpires" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    santri?: boolean | User$santriArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      santri: Prisma.$SantriPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      role: $Enums.Role
      banned: boolean | null
      banReason: string | null
      banExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    santri<T extends User$santriArgs<ExtArgs> = {}>(args?: Subset<T, User$santriArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly banReason: FieldRef<"User", 'String'>
    readonly banExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.santri
   */
  export type User$santriArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    where?: SantriWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Santri
   */

  export type AggregateSantri = {
    _count: SantriCountAggregateOutputType | null
    _min: SantriMinAggregateOutputType | null
    _max: SantriMaxAggregateOutputType | null
  }

  export type SantriMinAggregateOutputType = {
    id: string | null
    nis: string | null
    nama: string | null
    kelas: string | null
    asrama: string | null
    wali: string | null
    status: $Enums.StatusSantri | null
    beasiswa: boolean | null
    jenisBeasiswa: $Enums.JenisBeasiswa | null
    jenisSantri: $Enums.JenisSantri | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SantriMaxAggregateOutputType = {
    id: string | null
    nis: string | null
    nama: string | null
    kelas: string | null
    asrama: string | null
    wali: string | null
    status: $Enums.StatusSantri | null
    beasiswa: boolean | null
    jenisBeasiswa: $Enums.JenisBeasiswa | null
    jenisSantri: $Enums.JenisSantri | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SantriCountAggregateOutputType = {
    id: number
    nis: number
    nama: number
    kelas: number
    asrama: number
    wali: number
    status: number
    beasiswa: number
    jenisBeasiswa: number
    jenisSantri: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SantriMinAggregateInputType = {
    id?: true
    nis?: true
    nama?: true
    kelas?: true
    asrama?: true
    wali?: true
    status?: true
    beasiswa?: true
    jenisBeasiswa?: true
    jenisSantri?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SantriMaxAggregateInputType = {
    id?: true
    nis?: true
    nama?: true
    kelas?: true
    asrama?: true
    wali?: true
    status?: true
    beasiswa?: true
    jenisBeasiswa?: true
    jenisSantri?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SantriCountAggregateInputType = {
    id?: true
    nis?: true
    nama?: true
    kelas?: true
    asrama?: true
    wali?: true
    status?: true
    beasiswa?: true
    jenisBeasiswa?: true
    jenisSantri?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SantriAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Santri to aggregate.
     */
    where?: SantriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Santris to fetch.
     */
    orderBy?: SantriOrderByWithRelationInput | SantriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SantriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Santris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Santris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Santris
    **/
    _count?: true | SantriCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SantriMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SantriMaxAggregateInputType
  }

  export type GetSantriAggregateType<T extends SantriAggregateArgs> = {
        [P in keyof T & keyof AggregateSantri]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSantri[P]>
      : GetScalarType<T[P], AggregateSantri[P]>
  }




  export type SantriGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SantriWhereInput
    orderBy?: SantriOrderByWithAggregationInput | SantriOrderByWithAggregationInput[]
    by: SantriScalarFieldEnum[] | SantriScalarFieldEnum
    having?: SantriScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SantriCountAggregateInputType | true
    _min?: SantriMinAggregateInputType
    _max?: SantriMaxAggregateInputType
  }

  export type SantriGroupByOutputType = {
    id: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status: $Enums.StatusSantri
    beasiswa: boolean
    jenisBeasiswa: $Enums.JenisBeasiswa | null
    jenisSantri: $Enums.JenisSantri
    userId: string | null
    createdAt: Date
    updatedAt: Date
    _count: SantriCountAggregateOutputType | null
    _min: SantriMinAggregateOutputType | null
    _max: SantriMaxAggregateOutputType | null
  }

  type GetSantriGroupByPayload<T extends SantriGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SantriGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SantriGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SantriGroupByOutputType[P]>
            : GetScalarType<T[P], SantriGroupByOutputType[P]>
        }
      >
    >


  export type SantriSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nis?: boolean
    nama?: boolean
    kelas?: boolean
    asrama?: boolean
    wali?: boolean
    status?: boolean
    beasiswa?: boolean
    jenisBeasiswa?: boolean
    jenisSantri?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Santri$userArgs<ExtArgs>
    transaksi?: boolean | Santri$transaksiArgs<ExtArgs>
    tagihan?: boolean | Santri$tagihanArgs<ExtArgs>
    _count?: boolean | SantriCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["santri"]>

  export type SantriSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nis?: boolean
    nama?: boolean
    kelas?: boolean
    asrama?: boolean
    wali?: boolean
    status?: boolean
    beasiswa?: boolean
    jenisBeasiswa?: boolean
    jenisSantri?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Santri$userArgs<ExtArgs>
  }, ExtArgs["result"]["santri"]>

  export type SantriSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nis?: boolean
    nama?: boolean
    kelas?: boolean
    asrama?: boolean
    wali?: boolean
    status?: boolean
    beasiswa?: boolean
    jenisBeasiswa?: boolean
    jenisSantri?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Santri$userArgs<ExtArgs>
  }, ExtArgs["result"]["santri"]>

  export type SantriSelectScalar = {
    id?: boolean
    nis?: boolean
    nama?: boolean
    kelas?: boolean
    asrama?: boolean
    wali?: boolean
    status?: boolean
    beasiswa?: boolean
    jenisBeasiswa?: boolean
    jenisSantri?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SantriOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nis" | "nama" | "kelas" | "asrama" | "wali" | "status" | "beasiswa" | "jenisBeasiswa" | "jenisSantri" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["santri"]>
  export type SantriInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Santri$userArgs<ExtArgs>
    transaksi?: boolean | Santri$transaksiArgs<ExtArgs>
    tagihan?: boolean | Santri$tagihanArgs<ExtArgs>
    _count?: boolean | SantriCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SantriIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Santri$userArgs<ExtArgs>
  }
  export type SantriIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Santri$userArgs<ExtArgs>
  }

  export type $SantriPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Santri"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      transaksi: Prisma.$TransaksiPayload<ExtArgs>[]
      tagihan: Prisma.$TagihanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nis: string
      nama: string
      kelas: string
      asrama: string
      wali: string
      status: $Enums.StatusSantri
      beasiswa: boolean
      jenisBeasiswa: $Enums.JenisBeasiswa | null
      jenisSantri: $Enums.JenisSantri
      userId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["santri"]>
    composites: {}
  }

  type SantriGetPayload<S extends boolean | null | undefined | SantriDefaultArgs> = $Result.GetResult<Prisma.$SantriPayload, S>

  type SantriCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SantriFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SantriCountAggregateInputType | true
    }

  export interface SantriDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Santri'], meta: { name: 'Santri' } }
    /**
     * Find zero or one Santri that matches the filter.
     * @param {SantriFindUniqueArgs} args - Arguments to find a Santri
     * @example
     * // Get one Santri
     * const santri = await prisma.santri.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SantriFindUniqueArgs>(args: SelectSubset<T, SantriFindUniqueArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Santri that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SantriFindUniqueOrThrowArgs} args - Arguments to find a Santri
     * @example
     * // Get one Santri
     * const santri = await prisma.santri.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SantriFindUniqueOrThrowArgs>(args: SelectSubset<T, SantriFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Santri that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriFindFirstArgs} args - Arguments to find a Santri
     * @example
     * // Get one Santri
     * const santri = await prisma.santri.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SantriFindFirstArgs>(args?: SelectSubset<T, SantriFindFirstArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Santri that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriFindFirstOrThrowArgs} args - Arguments to find a Santri
     * @example
     * // Get one Santri
     * const santri = await prisma.santri.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SantriFindFirstOrThrowArgs>(args?: SelectSubset<T, SantriFindFirstOrThrowArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Santris that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Santris
     * const santris = await prisma.santri.findMany()
     * 
     * // Get first 10 Santris
     * const santris = await prisma.santri.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const santriWithIdOnly = await prisma.santri.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SantriFindManyArgs>(args?: SelectSubset<T, SantriFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Santri.
     * @param {SantriCreateArgs} args - Arguments to create a Santri.
     * @example
     * // Create one Santri
     * const Santri = await prisma.santri.create({
     *   data: {
     *     // ... data to create a Santri
     *   }
     * })
     * 
     */
    create<T extends SantriCreateArgs>(args: SelectSubset<T, SantriCreateArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Santris.
     * @param {SantriCreateManyArgs} args - Arguments to create many Santris.
     * @example
     * // Create many Santris
     * const santri = await prisma.santri.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SantriCreateManyArgs>(args?: SelectSubset<T, SantriCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Santris and returns the data saved in the database.
     * @param {SantriCreateManyAndReturnArgs} args - Arguments to create many Santris.
     * @example
     * // Create many Santris
     * const santri = await prisma.santri.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Santris and only return the `id`
     * const santriWithIdOnly = await prisma.santri.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SantriCreateManyAndReturnArgs>(args?: SelectSubset<T, SantriCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Santri.
     * @param {SantriDeleteArgs} args - Arguments to delete one Santri.
     * @example
     * // Delete one Santri
     * const Santri = await prisma.santri.delete({
     *   where: {
     *     // ... filter to delete one Santri
     *   }
     * })
     * 
     */
    delete<T extends SantriDeleteArgs>(args: SelectSubset<T, SantriDeleteArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Santri.
     * @param {SantriUpdateArgs} args - Arguments to update one Santri.
     * @example
     * // Update one Santri
     * const santri = await prisma.santri.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SantriUpdateArgs>(args: SelectSubset<T, SantriUpdateArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Santris.
     * @param {SantriDeleteManyArgs} args - Arguments to filter Santris to delete.
     * @example
     * // Delete a few Santris
     * const { count } = await prisma.santri.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SantriDeleteManyArgs>(args?: SelectSubset<T, SantriDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Santris.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Santris
     * const santri = await prisma.santri.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SantriUpdateManyArgs>(args: SelectSubset<T, SantriUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Santris and returns the data updated in the database.
     * @param {SantriUpdateManyAndReturnArgs} args - Arguments to update many Santris.
     * @example
     * // Update many Santris
     * const santri = await prisma.santri.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Santris and only return the `id`
     * const santriWithIdOnly = await prisma.santri.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SantriUpdateManyAndReturnArgs>(args: SelectSubset<T, SantriUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Santri.
     * @param {SantriUpsertArgs} args - Arguments to update or create a Santri.
     * @example
     * // Update or create a Santri
     * const santri = await prisma.santri.upsert({
     *   create: {
     *     // ... data to create a Santri
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Santri we want to update
     *   }
     * })
     */
    upsert<T extends SantriUpsertArgs>(args: SelectSubset<T, SantriUpsertArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Santris.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriCountArgs} args - Arguments to filter Santris to count.
     * @example
     * // Count the number of Santris
     * const count = await prisma.santri.count({
     *   where: {
     *     // ... the filter for the Santris we want to count
     *   }
     * })
    **/
    count<T extends SantriCountArgs>(
      args?: Subset<T, SantriCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SantriCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Santri.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SantriAggregateArgs>(args: Subset<T, SantriAggregateArgs>): Prisma.PrismaPromise<GetSantriAggregateType<T>>

    /**
     * Group by Santri.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SantriGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SantriGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SantriGroupByArgs['orderBy'] }
        : { orderBy?: SantriGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SantriGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSantriGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Santri model
   */
  readonly fields: SantriFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Santri.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SantriClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Santri$userArgs<ExtArgs> = {}>(args?: Subset<T, Santri$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    transaksi<T extends Santri$transaksiArgs<ExtArgs> = {}>(args?: Subset<T, Santri$transaksiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tagihan<T extends Santri$tagihanArgs<ExtArgs> = {}>(args?: Subset<T, Santri$tagihanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Santri model
   */
  interface SantriFieldRefs {
    readonly id: FieldRef<"Santri", 'String'>
    readonly nis: FieldRef<"Santri", 'String'>
    readonly nama: FieldRef<"Santri", 'String'>
    readonly kelas: FieldRef<"Santri", 'String'>
    readonly asrama: FieldRef<"Santri", 'String'>
    readonly wali: FieldRef<"Santri", 'String'>
    readonly status: FieldRef<"Santri", 'StatusSantri'>
    readonly beasiswa: FieldRef<"Santri", 'Boolean'>
    readonly jenisBeasiswa: FieldRef<"Santri", 'JenisBeasiswa'>
    readonly jenisSantri: FieldRef<"Santri", 'JenisSantri'>
    readonly userId: FieldRef<"Santri", 'String'>
    readonly createdAt: FieldRef<"Santri", 'DateTime'>
    readonly updatedAt: FieldRef<"Santri", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Santri findUnique
   */
  export type SantriFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter, which Santri to fetch.
     */
    where: SantriWhereUniqueInput
  }

  /**
   * Santri findUniqueOrThrow
   */
  export type SantriFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter, which Santri to fetch.
     */
    where: SantriWhereUniqueInput
  }

  /**
   * Santri findFirst
   */
  export type SantriFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter, which Santri to fetch.
     */
    where?: SantriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Santris to fetch.
     */
    orderBy?: SantriOrderByWithRelationInput | SantriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Santris.
     */
    cursor?: SantriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Santris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Santris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Santris.
     */
    distinct?: SantriScalarFieldEnum | SantriScalarFieldEnum[]
  }

  /**
   * Santri findFirstOrThrow
   */
  export type SantriFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter, which Santri to fetch.
     */
    where?: SantriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Santris to fetch.
     */
    orderBy?: SantriOrderByWithRelationInput | SantriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Santris.
     */
    cursor?: SantriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Santris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Santris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Santris.
     */
    distinct?: SantriScalarFieldEnum | SantriScalarFieldEnum[]
  }

  /**
   * Santri findMany
   */
  export type SantriFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter, which Santris to fetch.
     */
    where?: SantriWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Santris to fetch.
     */
    orderBy?: SantriOrderByWithRelationInput | SantriOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Santris.
     */
    cursor?: SantriWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Santris from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Santris.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Santris.
     */
    distinct?: SantriScalarFieldEnum | SantriScalarFieldEnum[]
  }

  /**
   * Santri create
   */
  export type SantriCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * The data needed to create a Santri.
     */
    data: XOR<SantriCreateInput, SantriUncheckedCreateInput>
  }

  /**
   * Santri createMany
   */
  export type SantriCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Santris.
     */
    data: SantriCreateManyInput | SantriCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Santri createManyAndReturn
   */
  export type SantriCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * The data used to create many Santris.
     */
    data: SantriCreateManyInput | SantriCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Santri update
   */
  export type SantriUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * The data needed to update a Santri.
     */
    data: XOR<SantriUpdateInput, SantriUncheckedUpdateInput>
    /**
     * Choose, which Santri to update.
     */
    where: SantriWhereUniqueInput
  }

  /**
   * Santri updateMany
   */
  export type SantriUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Santris.
     */
    data: XOR<SantriUpdateManyMutationInput, SantriUncheckedUpdateManyInput>
    /**
     * Filter which Santris to update
     */
    where?: SantriWhereInput
    /**
     * Limit how many Santris to update.
     */
    limit?: number
  }

  /**
   * Santri updateManyAndReturn
   */
  export type SantriUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * The data used to update Santris.
     */
    data: XOR<SantriUpdateManyMutationInput, SantriUncheckedUpdateManyInput>
    /**
     * Filter which Santris to update
     */
    where?: SantriWhereInput
    /**
     * Limit how many Santris to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Santri upsert
   */
  export type SantriUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * The filter to search for the Santri to update in case it exists.
     */
    where: SantriWhereUniqueInput
    /**
     * In case the Santri found by the `where` argument doesn't exist, create a new Santri with this data.
     */
    create: XOR<SantriCreateInput, SantriUncheckedCreateInput>
    /**
     * In case the Santri was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SantriUpdateInput, SantriUncheckedUpdateInput>
  }

  /**
   * Santri delete
   */
  export type SantriDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
    /**
     * Filter which Santri to delete.
     */
    where: SantriWhereUniqueInput
  }

  /**
   * Santri deleteMany
   */
  export type SantriDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Santris to delete
     */
    where?: SantriWhereInput
    /**
     * Limit how many Santris to delete.
     */
    limit?: number
  }

  /**
   * Santri.user
   */
  export type Santri$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Santri.transaksi
   */
  export type Santri$transaksiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    where?: TransaksiWhereInput
    orderBy?: TransaksiOrderByWithRelationInput | TransaksiOrderByWithRelationInput[]
    cursor?: TransaksiWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransaksiScalarFieldEnum | TransaksiScalarFieldEnum[]
  }

  /**
   * Santri.tagihan
   */
  export type Santri$tagihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    where?: TagihanWhereInput
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    cursor?: TagihanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagihanScalarFieldEnum | TagihanScalarFieldEnum[]
  }

  /**
   * Santri without action
   */
  export type SantriDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Santri
     */
    select?: SantriSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Santri
     */
    omit?: SantriOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SantriInclude<ExtArgs> | null
  }


  /**
   * Model Tagihan
   */

  export type AggregateTagihan = {
    _count: TagihanCountAggregateOutputType | null
    _avg: TagihanAvgAggregateOutputType | null
    _sum: TagihanSumAggregateOutputType | null
    _min: TagihanMinAggregateOutputType | null
    _max: TagihanMaxAggregateOutputType | null
  }

  export type TagihanAvgAggregateOutputType = {
    tahun: number | null
    jumlah: number | null
  }

  export type TagihanSumAggregateOutputType = {
    tahun: number | null
    jumlah: number | null
  }

  export type TagihanMinAggregateOutputType = {
    id: string | null
    kode: string | null
    santriId: string | null
    jenis: $Enums.JenisTagihan | null
    bulan: string | null
    tahun: number | null
    jumlah: number | null
    status: $Enums.StatusTagihan | null
    jatuhTempo: Date | null
    transaksiId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagihanMaxAggregateOutputType = {
    id: string | null
    kode: string | null
    santriId: string | null
    jenis: $Enums.JenisTagihan | null
    bulan: string | null
    tahun: number | null
    jumlah: number | null
    status: $Enums.StatusTagihan | null
    jatuhTempo: Date | null
    transaksiId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TagihanCountAggregateOutputType = {
    id: number
    kode: number
    santriId: number
    jenis: number
    bulan: number
    tahun: number
    jumlah: number
    status: number
    jatuhTempo: number
    transaksiId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TagihanAvgAggregateInputType = {
    tahun?: true
    jumlah?: true
  }

  export type TagihanSumAggregateInputType = {
    tahun?: true
    jumlah?: true
  }

  export type TagihanMinAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    tahun?: true
    jumlah?: true
    status?: true
    jatuhTempo?: true
    transaksiId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagihanMaxAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    tahun?: true
    jumlah?: true
    status?: true
    jatuhTempo?: true
    transaksiId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TagihanCountAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    tahun?: true
    jumlah?: true
    status?: true
    jatuhTempo?: true
    transaksiId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TagihanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tagihan to aggregate.
     */
    where?: TagihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tagihans to fetch.
     */
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tagihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tagihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tagihans
    **/
    _count?: true | TagihanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TagihanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TagihanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagihanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagihanMaxAggregateInputType
  }

  export type GetTagihanAggregateType<T extends TagihanAggregateArgs> = {
        [P in keyof T & keyof AggregateTagihan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTagihan[P]>
      : GetScalarType<T[P], AggregateTagihan[P]>
  }




  export type TagihanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagihanWhereInput
    orderBy?: TagihanOrderByWithAggregationInput | TagihanOrderByWithAggregationInput[]
    by: TagihanScalarFieldEnum[] | TagihanScalarFieldEnum
    having?: TagihanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagihanCountAggregateInputType | true
    _avg?: TagihanAvgAggregateInputType
    _sum?: TagihanSumAggregateInputType
    _min?: TagihanMinAggregateInputType
    _max?: TagihanMaxAggregateInputType
  }

  export type TagihanGroupByOutputType = {
    id: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status: $Enums.StatusTagihan
    jatuhTempo: Date
    transaksiId: string | null
    createdAt: Date
    updatedAt: Date
    _count: TagihanCountAggregateOutputType | null
    _avg: TagihanAvgAggregateOutputType | null
    _sum: TagihanSumAggregateOutputType | null
    _min: TagihanMinAggregateOutputType | null
    _max: TagihanMaxAggregateOutputType | null
  }

  type GetTagihanGroupByPayload<T extends TagihanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagihanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagihanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagihanGroupByOutputType[P]>
            : GetScalarType<T[P], TagihanGroupByOutputType[P]>
        }
      >
    >


  export type TagihanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    tahun?: boolean
    jumlah?: boolean
    status?: boolean
    jatuhTempo?: boolean
    transaksiId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }, ExtArgs["result"]["tagihan"]>

  export type TagihanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    tahun?: boolean
    jumlah?: boolean
    status?: boolean
    jatuhTempo?: boolean
    transaksiId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }, ExtArgs["result"]["tagihan"]>

  export type TagihanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    tahun?: boolean
    jumlah?: boolean
    status?: boolean
    jatuhTempo?: boolean
    transaksiId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }, ExtArgs["result"]["tagihan"]>

  export type TagihanSelectScalar = {
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    tahun?: boolean
    jumlah?: boolean
    status?: boolean
    jatuhTempo?: boolean
    transaksiId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TagihanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kode" | "santriId" | "jenis" | "bulan" | "tahun" | "jumlah" | "status" | "jatuhTempo" | "transaksiId" | "createdAt" | "updatedAt", ExtArgs["result"]["tagihan"]>
  export type TagihanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }
  export type TagihanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }
  export type TagihanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    transaksi?: boolean | Tagihan$transaksiArgs<ExtArgs>
  }

  export type $TagihanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tagihan"
    objects: {
      santri: Prisma.$SantriPayload<ExtArgs>
      transaksi: Prisma.$TransaksiPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kode: string
      santriId: string
      jenis: $Enums.JenisTagihan
      bulan: string
      tahun: number
      jumlah: number
      status: $Enums.StatusTagihan
      jatuhTempo: Date
      transaksiId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tagihan"]>
    composites: {}
  }

  type TagihanGetPayload<S extends boolean | null | undefined | TagihanDefaultArgs> = $Result.GetResult<Prisma.$TagihanPayload, S>

  type TagihanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagihanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagihanCountAggregateInputType | true
    }

  export interface TagihanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tagihan'], meta: { name: 'Tagihan' } }
    /**
     * Find zero or one Tagihan that matches the filter.
     * @param {TagihanFindUniqueArgs} args - Arguments to find a Tagihan
     * @example
     * // Get one Tagihan
     * const tagihan = await prisma.tagihan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagihanFindUniqueArgs>(args: SelectSubset<T, TagihanFindUniqueArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tagihan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagihanFindUniqueOrThrowArgs} args - Arguments to find a Tagihan
     * @example
     * // Get one Tagihan
     * const tagihan = await prisma.tagihan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagihanFindUniqueOrThrowArgs>(args: SelectSubset<T, TagihanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tagihan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanFindFirstArgs} args - Arguments to find a Tagihan
     * @example
     * // Get one Tagihan
     * const tagihan = await prisma.tagihan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagihanFindFirstArgs>(args?: SelectSubset<T, TagihanFindFirstArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tagihan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanFindFirstOrThrowArgs} args - Arguments to find a Tagihan
     * @example
     * // Get one Tagihan
     * const tagihan = await prisma.tagihan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagihanFindFirstOrThrowArgs>(args?: SelectSubset<T, TagihanFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tagihans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tagihans
     * const tagihans = await prisma.tagihan.findMany()
     * 
     * // Get first 10 Tagihans
     * const tagihans = await prisma.tagihan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagihanWithIdOnly = await prisma.tagihan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagihanFindManyArgs>(args?: SelectSubset<T, TagihanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tagihan.
     * @param {TagihanCreateArgs} args - Arguments to create a Tagihan.
     * @example
     * // Create one Tagihan
     * const Tagihan = await prisma.tagihan.create({
     *   data: {
     *     // ... data to create a Tagihan
     *   }
     * })
     * 
     */
    create<T extends TagihanCreateArgs>(args: SelectSubset<T, TagihanCreateArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tagihans.
     * @param {TagihanCreateManyArgs} args - Arguments to create many Tagihans.
     * @example
     * // Create many Tagihans
     * const tagihan = await prisma.tagihan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagihanCreateManyArgs>(args?: SelectSubset<T, TagihanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tagihans and returns the data saved in the database.
     * @param {TagihanCreateManyAndReturnArgs} args - Arguments to create many Tagihans.
     * @example
     * // Create many Tagihans
     * const tagihan = await prisma.tagihan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tagihans and only return the `id`
     * const tagihanWithIdOnly = await prisma.tagihan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagihanCreateManyAndReturnArgs>(args?: SelectSubset<T, TagihanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tagihan.
     * @param {TagihanDeleteArgs} args - Arguments to delete one Tagihan.
     * @example
     * // Delete one Tagihan
     * const Tagihan = await prisma.tagihan.delete({
     *   where: {
     *     // ... filter to delete one Tagihan
     *   }
     * })
     * 
     */
    delete<T extends TagihanDeleteArgs>(args: SelectSubset<T, TagihanDeleteArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tagihan.
     * @param {TagihanUpdateArgs} args - Arguments to update one Tagihan.
     * @example
     * // Update one Tagihan
     * const tagihan = await prisma.tagihan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagihanUpdateArgs>(args: SelectSubset<T, TagihanUpdateArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tagihans.
     * @param {TagihanDeleteManyArgs} args - Arguments to filter Tagihans to delete.
     * @example
     * // Delete a few Tagihans
     * const { count } = await prisma.tagihan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagihanDeleteManyArgs>(args?: SelectSubset<T, TagihanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tagihans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tagihans
     * const tagihan = await prisma.tagihan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagihanUpdateManyArgs>(args: SelectSubset<T, TagihanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tagihans and returns the data updated in the database.
     * @param {TagihanUpdateManyAndReturnArgs} args - Arguments to update many Tagihans.
     * @example
     * // Update many Tagihans
     * const tagihan = await prisma.tagihan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tagihans and only return the `id`
     * const tagihanWithIdOnly = await prisma.tagihan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagihanUpdateManyAndReturnArgs>(args: SelectSubset<T, TagihanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tagihan.
     * @param {TagihanUpsertArgs} args - Arguments to update or create a Tagihan.
     * @example
     * // Update or create a Tagihan
     * const tagihan = await prisma.tagihan.upsert({
     *   create: {
     *     // ... data to create a Tagihan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tagihan we want to update
     *   }
     * })
     */
    upsert<T extends TagihanUpsertArgs>(args: SelectSubset<T, TagihanUpsertArgs<ExtArgs>>): Prisma__TagihanClient<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tagihans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanCountArgs} args - Arguments to filter Tagihans to count.
     * @example
     * // Count the number of Tagihans
     * const count = await prisma.tagihan.count({
     *   where: {
     *     // ... the filter for the Tagihans we want to count
     *   }
     * })
    **/
    count<T extends TagihanCountArgs>(
      args?: Subset<T, TagihanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagihanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tagihan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagihanAggregateArgs>(args: Subset<T, TagihanAggregateArgs>): Prisma.PrismaPromise<GetTagihanAggregateType<T>>

    /**
     * Group by Tagihan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagihanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagihanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagihanGroupByArgs['orderBy'] }
        : { orderBy?: TagihanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagihanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagihanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tagihan model
   */
  readonly fields: TagihanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tagihan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagihanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    santri<T extends SantriDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SantriDefaultArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transaksi<T extends Tagihan$transaksiArgs<ExtArgs> = {}>(args?: Subset<T, Tagihan$transaksiArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tagihan model
   */
  interface TagihanFieldRefs {
    readonly id: FieldRef<"Tagihan", 'String'>
    readonly kode: FieldRef<"Tagihan", 'String'>
    readonly santriId: FieldRef<"Tagihan", 'String'>
    readonly jenis: FieldRef<"Tagihan", 'JenisTagihan'>
    readonly bulan: FieldRef<"Tagihan", 'String'>
    readonly tahun: FieldRef<"Tagihan", 'Int'>
    readonly jumlah: FieldRef<"Tagihan", 'Int'>
    readonly status: FieldRef<"Tagihan", 'StatusTagihan'>
    readonly jatuhTempo: FieldRef<"Tagihan", 'DateTime'>
    readonly transaksiId: FieldRef<"Tagihan", 'String'>
    readonly createdAt: FieldRef<"Tagihan", 'DateTime'>
    readonly updatedAt: FieldRef<"Tagihan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tagihan findUnique
   */
  export type TagihanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter, which Tagihan to fetch.
     */
    where: TagihanWhereUniqueInput
  }

  /**
   * Tagihan findUniqueOrThrow
   */
  export type TagihanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter, which Tagihan to fetch.
     */
    where: TagihanWhereUniqueInput
  }

  /**
   * Tagihan findFirst
   */
  export type TagihanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter, which Tagihan to fetch.
     */
    where?: TagihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tagihans to fetch.
     */
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tagihans.
     */
    cursor?: TagihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tagihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tagihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tagihans.
     */
    distinct?: TagihanScalarFieldEnum | TagihanScalarFieldEnum[]
  }

  /**
   * Tagihan findFirstOrThrow
   */
  export type TagihanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter, which Tagihan to fetch.
     */
    where?: TagihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tagihans to fetch.
     */
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tagihans.
     */
    cursor?: TagihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tagihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tagihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tagihans.
     */
    distinct?: TagihanScalarFieldEnum | TagihanScalarFieldEnum[]
  }

  /**
   * Tagihan findMany
   */
  export type TagihanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter, which Tagihans to fetch.
     */
    where?: TagihanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tagihans to fetch.
     */
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tagihans.
     */
    cursor?: TagihanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tagihans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tagihans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tagihans.
     */
    distinct?: TagihanScalarFieldEnum | TagihanScalarFieldEnum[]
  }

  /**
   * Tagihan create
   */
  export type TagihanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * The data needed to create a Tagihan.
     */
    data: XOR<TagihanCreateInput, TagihanUncheckedCreateInput>
  }

  /**
   * Tagihan createMany
   */
  export type TagihanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tagihans.
     */
    data: TagihanCreateManyInput | TagihanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tagihan createManyAndReturn
   */
  export type TagihanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * The data used to create many Tagihans.
     */
    data: TagihanCreateManyInput | TagihanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tagihan update
   */
  export type TagihanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * The data needed to update a Tagihan.
     */
    data: XOR<TagihanUpdateInput, TagihanUncheckedUpdateInput>
    /**
     * Choose, which Tagihan to update.
     */
    where: TagihanWhereUniqueInput
  }

  /**
   * Tagihan updateMany
   */
  export type TagihanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tagihans.
     */
    data: XOR<TagihanUpdateManyMutationInput, TagihanUncheckedUpdateManyInput>
    /**
     * Filter which Tagihans to update
     */
    where?: TagihanWhereInput
    /**
     * Limit how many Tagihans to update.
     */
    limit?: number
  }

  /**
   * Tagihan updateManyAndReturn
   */
  export type TagihanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * The data used to update Tagihans.
     */
    data: XOR<TagihanUpdateManyMutationInput, TagihanUncheckedUpdateManyInput>
    /**
     * Filter which Tagihans to update
     */
    where?: TagihanWhereInput
    /**
     * Limit how many Tagihans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Tagihan upsert
   */
  export type TagihanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * The filter to search for the Tagihan to update in case it exists.
     */
    where: TagihanWhereUniqueInput
    /**
     * In case the Tagihan found by the `where` argument doesn't exist, create a new Tagihan with this data.
     */
    create: XOR<TagihanCreateInput, TagihanUncheckedCreateInput>
    /**
     * In case the Tagihan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagihanUpdateInput, TagihanUncheckedUpdateInput>
  }

  /**
   * Tagihan delete
   */
  export type TagihanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    /**
     * Filter which Tagihan to delete.
     */
    where: TagihanWhereUniqueInput
  }

  /**
   * Tagihan deleteMany
   */
  export type TagihanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tagihans to delete
     */
    where?: TagihanWhereInput
    /**
     * Limit how many Tagihans to delete.
     */
    limit?: number
  }

  /**
   * Tagihan.transaksi
   */
  export type Tagihan$transaksiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    where?: TransaksiWhereInput
  }

  /**
   * Tagihan without action
   */
  export type TagihanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
  }


  /**
   * Model Transaksi
   */

  export type AggregateTransaksi = {
    _count: TransaksiCountAggregateOutputType | null
    _avg: TransaksiAvgAggregateOutputType | null
    _sum: TransaksiSumAggregateOutputType | null
    _min: TransaksiMinAggregateOutputType | null
    _max: TransaksiMaxAggregateOutputType | null
  }

  export type TransaksiAvgAggregateOutputType = {
    tahun: number | null
    jumlah: number | null
  }

  export type TransaksiSumAggregateOutputType = {
    tahun: number | null
    jumlah: number | null
  }

  export type TransaksiMinAggregateOutputType = {
    id: string | null
    kode: string | null
    santriId: string | null
    jenis: $Enums.JenisTransaksi | null
    bulan: string | null
    periodePembayaran: $Enums.PeriodePembayaran | null
    tahun: number | null
    jumlah: number | null
    tanggalBayar: Date | null
    status: $Enums.StatusTransaksi | null
    statusUangSaku: $Enums.StatusUangSaku | null
    jenisLaundry: string | null
    keterangan: string | null
    managedBy: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransaksiMaxAggregateOutputType = {
    id: string | null
    kode: string | null
    santriId: string | null
    jenis: $Enums.JenisTransaksi | null
    bulan: string | null
    periodePembayaran: $Enums.PeriodePembayaran | null
    tahun: number | null
    jumlah: number | null
    tanggalBayar: Date | null
    status: $Enums.StatusTransaksi | null
    statusUangSaku: $Enums.StatusUangSaku | null
    jenisLaundry: string | null
    keterangan: string | null
    managedBy: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransaksiCountAggregateOutputType = {
    id: number
    kode: number
    santriId: number
    jenis: number
    bulan: number
    periodePembayaran: number
    tahun: number
    jumlah: number
    tanggalBayar: number
    status: number
    statusUangSaku: number
    jenisLaundry: number
    keterangan: number
    managedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransaksiAvgAggregateInputType = {
    tahun?: true
    jumlah?: true
  }

  export type TransaksiSumAggregateInputType = {
    tahun?: true
    jumlah?: true
  }

  export type TransaksiMinAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    periodePembayaran?: true
    tahun?: true
    jumlah?: true
    tanggalBayar?: true
    status?: true
    statusUangSaku?: true
    jenisLaundry?: true
    keterangan?: true
    managedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransaksiMaxAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    periodePembayaran?: true
    tahun?: true
    jumlah?: true
    tanggalBayar?: true
    status?: true
    statusUangSaku?: true
    jenisLaundry?: true
    keterangan?: true
    managedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransaksiCountAggregateInputType = {
    id?: true
    kode?: true
    santriId?: true
    jenis?: true
    bulan?: true
    periodePembayaran?: true
    tahun?: true
    jumlah?: true
    tanggalBayar?: true
    status?: true
    statusUangSaku?: true
    jenisLaundry?: true
    keterangan?: true
    managedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransaksiAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaksi to aggregate.
     */
    where?: TransaksiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaksis to fetch.
     */
    orderBy?: TransaksiOrderByWithRelationInput | TransaksiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransaksiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaksis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaksis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transaksis
    **/
    _count?: true | TransaksiCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransaksiAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransaksiSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransaksiMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransaksiMaxAggregateInputType
  }

  export type GetTransaksiAggregateType<T extends TransaksiAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaksi]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaksi[P]>
      : GetScalarType<T[P], AggregateTransaksi[P]>
  }




  export type TransaksiGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaksiWhereInput
    orderBy?: TransaksiOrderByWithAggregationInput | TransaksiOrderByWithAggregationInput[]
    by: TransaksiScalarFieldEnum[] | TransaksiScalarFieldEnum
    having?: TransaksiScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransaksiCountAggregateInputType | true
    _avg?: TransaksiAvgAggregateInputType
    _sum?: TransaksiSumAggregateInputType
    _min?: TransaksiMinAggregateInputType
    _max?: TransaksiMaxAggregateInputType
  }

  export type TransaksiGroupByOutputType = {
    id: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTransaksi
    bulan: string | null
    periodePembayaran: $Enums.PeriodePembayaran | null
    tahun: number | null
    jumlah: number
    tanggalBayar: Date | null
    status: $Enums.StatusTransaksi
    statusUangSaku: $Enums.StatusUangSaku | null
    jenisLaundry: string | null
    keterangan: string | null
    managedBy: $Enums.Role | null
    createdAt: Date
    updatedAt: Date
    _count: TransaksiCountAggregateOutputType | null
    _avg: TransaksiAvgAggregateOutputType | null
    _sum: TransaksiSumAggregateOutputType | null
    _min: TransaksiMinAggregateOutputType | null
    _max: TransaksiMaxAggregateOutputType | null
  }

  type GetTransaksiGroupByPayload<T extends TransaksiGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransaksiGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransaksiGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransaksiGroupByOutputType[P]>
            : GetScalarType<T[P], TransaksiGroupByOutputType[P]>
        }
      >
    >


  export type TransaksiSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    periodePembayaran?: boolean
    tahun?: boolean
    jumlah?: boolean
    tanggalBayar?: boolean
    status?: boolean
    statusUangSaku?: boolean
    jenisLaundry?: boolean
    keterangan?: boolean
    managedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    midtransTransactions?: boolean | Transaksi$midtransTransactionsArgs<ExtArgs>
    tagihan?: boolean | Transaksi$tagihanArgs<ExtArgs>
    _count?: boolean | TransaksiCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaksi"]>

  export type TransaksiSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    periodePembayaran?: boolean
    tahun?: boolean
    jumlah?: boolean
    tanggalBayar?: boolean
    status?: boolean
    statusUangSaku?: boolean
    jenisLaundry?: boolean
    keterangan?: boolean
    managedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaksi"]>

  export type TransaksiSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    periodePembayaran?: boolean
    tahun?: boolean
    jumlah?: boolean
    tanggalBayar?: boolean
    status?: boolean
    statusUangSaku?: boolean
    jenisLaundry?: boolean
    keterangan?: boolean
    managedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    santri?: boolean | SantriDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaksi"]>

  export type TransaksiSelectScalar = {
    id?: boolean
    kode?: boolean
    santriId?: boolean
    jenis?: boolean
    bulan?: boolean
    periodePembayaran?: boolean
    tahun?: boolean
    jumlah?: boolean
    tanggalBayar?: boolean
    status?: boolean
    statusUangSaku?: boolean
    jenisLaundry?: boolean
    keterangan?: boolean
    managedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransaksiOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kode" | "santriId" | "jenis" | "bulan" | "periodePembayaran" | "tahun" | "jumlah" | "tanggalBayar" | "status" | "statusUangSaku" | "jenisLaundry" | "keterangan" | "managedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["transaksi"]>
  export type TransaksiInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
    midtransTransactions?: boolean | Transaksi$midtransTransactionsArgs<ExtArgs>
    tagihan?: boolean | Transaksi$tagihanArgs<ExtArgs>
    _count?: boolean | TransaksiCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TransaksiIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
  }
  export type TransaksiIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    santri?: boolean | SantriDefaultArgs<ExtArgs>
  }

  export type $TransaksiPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaksi"
    objects: {
      santri: Prisma.$SantriPayload<ExtArgs>
      midtransTransactions: Prisma.$MidtransTransactionPayload<ExtArgs>[]
      tagihan: Prisma.$TagihanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kode: string
      santriId: string
      jenis: $Enums.JenisTransaksi
      bulan: string | null
      periodePembayaran: $Enums.PeriodePembayaran | null
      tahun: number | null
      jumlah: number
      tanggalBayar: Date | null
      status: $Enums.StatusTransaksi
      statusUangSaku: $Enums.StatusUangSaku | null
      jenisLaundry: string | null
      keterangan: string | null
      managedBy: $Enums.Role | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaksi"]>
    composites: {}
  }

  type TransaksiGetPayload<S extends boolean | null | undefined | TransaksiDefaultArgs> = $Result.GetResult<Prisma.$TransaksiPayload, S>

  type TransaksiCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransaksiFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransaksiCountAggregateInputType | true
    }

  export interface TransaksiDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaksi'], meta: { name: 'Transaksi' } }
    /**
     * Find zero or one Transaksi that matches the filter.
     * @param {TransaksiFindUniqueArgs} args - Arguments to find a Transaksi
     * @example
     * // Get one Transaksi
     * const transaksi = await prisma.transaksi.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransaksiFindUniqueArgs>(args: SelectSubset<T, TransaksiFindUniqueArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaksi that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransaksiFindUniqueOrThrowArgs} args - Arguments to find a Transaksi
     * @example
     * // Get one Transaksi
     * const transaksi = await prisma.transaksi.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransaksiFindUniqueOrThrowArgs>(args: SelectSubset<T, TransaksiFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaksi that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiFindFirstArgs} args - Arguments to find a Transaksi
     * @example
     * // Get one Transaksi
     * const transaksi = await prisma.transaksi.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransaksiFindFirstArgs>(args?: SelectSubset<T, TransaksiFindFirstArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaksi that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiFindFirstOrThrowArgs} args - Arguments to find a Transaksi
     * @example
     * // Get one Transaksi
     * const transaksi = await prisma.transaksi.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransaksiFindFirstOrThrowArgs>(args?: SelectSubset<T, TransaksiFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transaksis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transaksis
     * const transaksis = await prisma.transaksi.findMany()
     * 
     * // Get first 10 Transaksis
     * const transaksis = await prisma.transaksi.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transaksiWithIdOnly = await prisma.transaksi.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransaksiFindManyArgs>(args?: SelectSubset<T, TransaksiFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaksi.
     * @param {TransaksiCreateArgs} args - Arguments to create a Transaksi.
     * @example
     * // Create one Transaksi
     * const Transaksi = await prisma.transaksi.create({
     *   data: {
     *     // ... data to create a Transaksi
     *   }
     * })
     * 
     */
    create<T extends TransaksiCreateArgs>(args: SelectSubset<T, TransaksiCreateArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transaksis.
     * @param {TransaksiCreateManyArgs} args - Arguments to create many Transaksis.
     * @example
     * // Create many Transaksis
     * const transaksi = await prisma.transaksi.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransaksiCreateManyArgs>(args?: SelectSubset<T, TransaksiCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transaksis and returns the data saved in the database.
     * @param {TransaksiCreateManyAndReturnArgs} args - Arguments to create many Transaksis.
     * @example
     * // Create many Transaksis
     * const transaksi = await prisma.transaksi.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transaksis and only return the `id`
     * const transaksiWithIdOnly = await prisma.transaksi.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransaksiCreateManyAndReturnArgs>(args?: SelectSubset<T, TransaksiCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaksi.
     * @param {TransaksiDeleteArgs} args - Arguments to delete one Transaksi.
     * @example
     * // Delete one Transaksi
     * const Transaksi = await prisma.transaksi.delete({
     *   where: {
     *     // ... filter to delete one Transaksi
     *   }
     * })
     * 
     */
    delete<T extends TransaksiDeleteArgs>(args: SelectSubset<T, TransaksiDeleteArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaksi.
     * @param {TransaksiUpdateArgs} args - Arguments to update one Transaksi.
     * @example
     * // Update one Transaksi
     * const transaksi = await prisma.transaksi.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransaksiUpdateArgs>(args: SelectSubset<T, TransaksiUpdateArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transaksis.
     * @param {TransaksiDeleteManyArgs} args - Arguments to filter Transaksis to delete.
     * @example
     * // Delete a few Transaksis
     * const { count } = await prisma.transaksi.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransaksiDeleteManyArgs>(args?: SelectSubset<T, TransaksiDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transaksis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transaksis
     * const transaksi = await prisma.transaksi.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransaksiUpdateManyArgs>(args: SelectSubset<T, TransaksiUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transaksis and returns the data updated in the database.
     * @param {TransaksiUpdateManyAndReturnArgs} args - Arguments to update many Transaksis.
     * @example
     * // Update many Transaksis
     * const transaksi = await prisma.transaksi.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transaksis and only return the `id`
     * const transaksiWithIdOnly = await prisma.transaksi.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransaksiUpdateManyAndReturnArgs>(args: SelectSubset<T, TransaksiUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaksi.
     * @param {TransaksiUpsertArgs} args - Arguments to update or create a Transaksi.
     * @example
     * // Update or create a Transaksi
     * const transaksi = await prisma.transaksi.upsert({
     *   create: {
     *     // ... data to create a Transaksi
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaksi we want to update
     *   }
     * })
     */
    upsert<T extends TransaksiUpsertArgs>(args: SelectSubset<T, TransaksiUpsertArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transaksis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiCountArgs} args - Arguments to filter Transaksis to count.
     * @example
     * // Count the number of Transaksis
     * const count = await prisma.transaksi.count({
     *   where: {
     *     // ... the filter for the Transaksis we want to count
     *   }
     * })
    **/
    count<T extends TransaksiCountArgs>(
      args?: Subset<T, TransaksiCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransaksiCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaksi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransaksiAggregateArgs>(args: Subset<T, TransaksiAggregateArgs>): Prisma.PrismaPromise<GetTransaksiAggregateType<T>>

    /**
     * Group by Transaksi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaksiGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransaksiGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransaksiGroupByArgs['orderBy'] }
        : { orderBy?: TransaksiGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransaksiGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransaksiGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaksi model
   */
  readonly fields: TransaksiFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaksi.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransaksiClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    santri<T extends SantriDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SantriDefaultArgs<ExtArgs>>): Prisma__SantriClient<$Result.GetResult<Prisma.$SantriPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    midtransTransactions<T extends Transaksi$midtransTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Transaksi$midtransTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tagihan<T extends Transaksi$tagihanArgs<ExtArgs> = {}>(args?: Subset<T, Transaksi$tagihanArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagihanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaksi model
   */
  interface TransaksiFieldRefs {
    readonly id: FieldRef<"Transaksi", 'String'>
    readonly kode: FieldRef<"Transaksi", 'String'>
    readonly santriId: FieldRef<"Transaksi", 'String'>
    readonly jenis: FieldRef<"Transaksi", 'JenisTransaksi'>
    readonly bulan: FieldRef<"Transaksi", 'String'>
    readonly periodePembayaran: FieldRef<"Transaksi", 'PeriodePembayaran'>
    readonly tahun: FieldRef<"Transaksi", 'Int'>
    readonly jumlah: FieldRef<"Transaksi", 'Int'>
    readonly tanggalBayar: FieldRef<"Transaksi", 'DateTime'>
    readonly status: FieldRef<"Transaksi", 'StatusTransaksi'>
    readonly statusUangSaku: FieldRef<"Transaksi", 'StatusUangSaku'>
    readonly jenisLaundry: FieldRef<"Transaksi", 'String'>
    readonly keterangan: FieldRef<"Transaksi", 'String'>
    readonly managedBy: FieldRef<"Transaksi", 'Role'>
    readonly createdAt: FieldRef<"Transaksi", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaksi", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaksi findUnique
   */
  export type TransaksiFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter, which Transaksi to fetch.
     */
    where: TransaksiWhereUniqueInput
  }

  /**
   * Transaksi findUniqueOrThrow
   */
  export type TransaksiFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter, which Transaksi to fetch.
     */
    where: TransaksiWhereUniqueInput
  }

  /**
   * Transaksi findFirst
   */
  export type TransaksiFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter, which Transaksi to fetch.
     */
    where?: TransaksiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaksis to fetch.
     */
    orderBy?: TransaksiOrderByWithRelationInput | TransaksiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transaksis.
     */
    cursor?: TransaksiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaksis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaksis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transaksis.
     */
    distinct?: TransaksiScalarFieldEnum | TransaksiScalarFieldEnum[]
  }

  /**
   * Transaksi findFirstOrThrow
   */
  export type TransaksiFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter, which Transaksi to fetch.
     */
    where?: TransaksiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaksis to fetch.
     */
    orderBy?: TransaksiOrderByWithRelationInput | TransaksiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transaksis.
     */
    cursor?: TransaksiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaksis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaksis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transaksis.
     */
    distinct?: TransaksiScalarFieldEnum | TransaksiScalarFieldEnum[]
  }

  /**
   * Transaksi findMany
   */
  export type TransaksiFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter, which Transaksis to fetch.
     */
    where?: TransaksiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaksis to fetch.
     */
    orderBy?: TransaksiOrderByWithRelationInput | TransaksiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transaksis.
     */
    cursor?: TransaksiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaksis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaksis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transaksis.
     */
    distinct?: TransaksiScalarFieldEnum | TransaksiScalarFieldEnum[]
  }

  /**
   * Transaksi create
   */
  export type TransaksiCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaksi.
     */
    data: XOR<TransaksiCreateInput, TransaksiUncheckedCreateInput>
  }

  /**
   * Transaksi createMany
   */
  export type TransaksiCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transaksis.
     */
    data: TransaksiCreateManyInput | TransaksiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaksi createManyAndReturn
   */
  export type TransaksiCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * The data used to create many Transaksis.
     */
    data: TransaksiCreateManyInput | TransaksiCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaksi update
   */
  export type TransaksiUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaksi.
     */
    data: XOR<TransaksiUpdateInput, TransaksiUncheckedUpdateInput>
    /**
     * Choose, which Transaksi to update.
     */
    where: TransaksiWhereUniqueInput
  }

  /**
   * Transaksi updateMany
   */
  export type TransaksiUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transaksis.
     */
    data: XOR<TransaksiUpdateManyMutationInput, TransaksiUncheckedUpdateManyInput>
    /**
     * Filter which Transaksis to update
     */
    where?: TransaksiWhereInput
    /**
     * Limit how many Transaksis to update.
     */
    limit?: number
  }

  /**
   * Transaksi updateManyAndReturn
   */
  export type TransaksiUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * The data used to update Transaksis.
     */
    data: XOR<TransaksiUpdateManyMutationInput, TransaksiUncheckedUpdateManyInput>
    /**
     * Filter which Transaksis to update
     */
    where?: TransaksiWhereInput
    /**
     * Limit how many Transaksis to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaksi upsert
   */
  export type TransaksiUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaksi to update in case it exists.
     */
    where: TransaksiWhereUniqueInput
    /**
     * In case the Transaksi found by the `where` argument doesn't exist, create a new Transaksi with this data.
     */
    create: XOR<TransaksiCreateInput, TransaksiUncheckedCreateInput>
    /**
     * In case the Transaksi was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransaksiUpdateInput, TransaksiUncheckedUpdateInput>
  }

  /**
   * Transaksi delete
   */
  export type TransaksiDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
    /**
     * Filter which Transaksi to delete.
     */
    where: TransaksiWhereUniqueInput
  }

  /**
   * Transaksi deleteMany
   */
  export type TransaksiDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaksis to delete
     */
    where?: TransaksiWhereInput
    /**
     * Limit how many Transaksis to delete.
     */
    limit?: number
  }

  /**
   * Transaksi.midtransTransactions
   */
  export type Transaksi$midtransTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    where?: MidtransTransactionWhereInput
    orderBy?: MidtransTransactionOrderByWithRelationInput | MidtransTransactionOrderByWithRelationInput[]
    cursor?: MidtransTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MidtransTransactionScalarFieldEnum | MidtransTransactionScalarFieldEnum[]
  }

  /**
   * Transaksi.tagihan
   */
  export type Transaksi$tagihanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tagihan
     */
    select?: TagihanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tagihan
     */
    omit?: TagihanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagihanInclude<ExtArgs> | null
    where?: TagihanWhereInput
    orderBy?: TagihanOrderByWithRelationInput | TagihanOrderByWithRelationInput[]
    cursor?: TagihanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagihanScalarFieldEnum | TagihanScalarFieldEnum[]
  }

  /**
   * Transaksi without action
   */
  export type TransaksiDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaksi
     */
    select?: TransaksiSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaksi
     */
    omit?: TransaksiOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaksiInclude<ExtArgs> | null
  }


  /**
   * Model MidtransTransaction
   */

  export type AggregateMidtransTransaction = {
    _count: MidtransTransactionCountAggregateOutputType | null
    _avg: MidtransTransactionAvgAggregateOutputType | null
    _sum: MidtransTransactionSumAggregateOutputType | null
    _min: MidtransTransactionMinAggregateOutputType | null
    _max: MidtransTransactionMaxAggregateOutputType | null
  }

  export type MidtransTransactionAvgAggregateOutputType = {
    grossAmount: number | null
  }

  export type MidtransTransactionSumAggregateOutputType = {
    grossAmount: number | null
  }

  export type MidtransTransactionMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    transactionId: string | null
    transaksiId: string | null
    grossAmount: number | null
    paymentType: string | null
    transactionStatus: string | null
    fraudStatus: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MidtransTransactionMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    transactionId: string | null
    transaksiId: string | null
    grossAmount: number | null
    paymentType: string | null
    transactionStatus: string | null
    fraudStatus: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MidtransTransactionCountAggregateOutputType = {
    id: number
    orderId: number
    transactionId: number
    transaksiId: number
    grossAmount: number
    paymentType: number
    transactionStatus: number
    fraudStatus: number
    transactionTime: number
    settlementTime: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MidtransTransactionAvgAggregateInputType = {
    grossAmount?: true
  }

  export type MidtransTransactionSumAggregateInputType = {
    grossAmount?: true
  }

  export type MidtransTransactionMinAggregateInputType = {
    id?: true
    orderId?: true
    transactionId?: true
    transaksiId?: true
    grossAmount?: true
    paymentType?: true
    transactionStatus?: true
    fraudStatus?: true
    transactionTime?: true
    settlementTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MidtransTransactionMaxAggregateInputType = {
    id?: true
    orderId?: true
    transactionId?: true
    transaksiId?: true
    grossAmount?: true
    paymentType?: true
    transactionStatus?: true
    fraudStatus?: true
    transactionTime?: true
    settlementTime?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MidtransTransactionCountAggregateInputType = {
    id?: true
    orderId?: true
    transactionId?: true
    transaksiId?: true
    grossAmount?: true
    paymentType?: true
    transactionStatus?: true
    fraudStatus?: true
    transactionTime?: true
    settlementTime?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MidtransTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MidtransTransaction to aggregate.
     */
    where?: MidtransTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MidtransTransactions to fetch.
     */
    orderBy?: MidtransTransactionOrderByWithRelationInput | MidtransTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MidtransTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MidtransTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MidtransTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MidtransTransactions
    **/
    _count?: true | MidtransTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MidtransTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MidtransTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MidtransTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MidtransTransactionMaxAggregateInputType
  }

  export type GetMidtransTransactionAggregateType<T extends MidtransTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateMidtransTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMidtransTransaction[P]>
      : GetScalarType<T[P], AggregateMidtransTransaction[P]>
  }




  export type MidtransTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MidtransTransactionWhereInput
    orderBy?: MidtransTransactionOrderByWithAggregationInput | MidtransTransactionOrderByWithAggregationInput[]
    by: MidtransTransactionScalarFieldEnum[] | MidtransTransactionScalarFieldEnum
    having?: MidtransTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MidtransTransactionCountAggregateInputType | true
    _avg?: MidtransTransactionAvgAggregateInputType
    _sum?: MidtransTransactionSumAggregateInputType
    _min?: MidtransTransactionMinAggregateInputType
    _max?: MidtransTransactionMaxAggregateInputType
  }

  export type MidtransTransactionGroupByOutputType = {
    id: string
    orderId: string
    transactionId: string | null
    transaksiId: string
    grossAmount: number
    paymentType: string | null
    transactionStatus: string
    fraudStatus: string | null
    transactionTime: Date | null
    settlementTime: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MidtransTransactionCountAggregateOutputType | null
    _avg: MidtransTransactionAvgAggregateOutputType | null
    _sum: MidtransTransactionSumAggregateOutputType | null
    _min: MidtransTransactionMinAggregateOutputType | null
    _max: MidtransTransactionMaxAggregateOutputType | null
  }

  type GetMidtransTransactionGroupByPayload<T extends MidtransTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MidtransTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MidtransTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MidtransTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], MidtransTransactionGroupByOutputType[P]>
        }
      >
    >


  export type MidtransTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    transactionId?: boolean
    transaksiId?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionStatus?: boolean
    fraudStatus?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["midtransTransaction"]>

  export type MidtransTransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    transactionId?: boolean
    transaksiId?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionStatus?: boolean
    fraudStatus?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["midtransTransaction"]>

  export type MidtransTransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    transactionId?: boolean
    transaksiId?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionStatus?: boolean
    fraudStatus?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["midtransTransaction"]>

  export type MidtransTransactionSelectScalar = {
    id?: boolean
    orderId?: boolean
    transactionId?: boolean
    transaksiId?: boolean
    grossAmount?: boolean
    paymentType?: boolean
    transactionStatus?: boolean
    fraudStatus?: boolean
    transactionTime?: boolean
    settlementTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MidtransTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "transactionId" | "transaksiId" | "grossAmount" | "paymentType" | "transactionStatus" | "fraudStatus" | "transactionTime" | "settlementTime" | "createdAt" | "updatedAt", ExtArgs["result"]["midtransTransaction"]>
  export type MidtransTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }
  export type MidtransTransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }
  export type MidtransTransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transaksi?: boolean | TransaksiDefaultArgs<ExtArgs>
  }

  export type $MidtransTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MidtransTransaction"
    objects: {
      transaksi: Prisma.$TransaksiPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      transactionId: string | null
      transaksiId: string
      grossAmount: number
      paymentType: string | null
      transactionStatus: string
      fraudStatus: string | null
      transactionTime: Date | null
      settlementTime: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["midtransTransaction"]>
    composites: {}
  }

  type MidtransTransactionGetPayload<S extends boolean | null | undefined | MidtransTransactionDefaultArgs> = $Result.GetResult<Prisma.$MidtransTransactionPayload, S>

  type MidtransTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MidtransTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MidtransTransactionCountAggregateInputType | true
    }

  export interface MidtransTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MidtransTransaction'], meta: { name: 'MidtransTransaction' } }
    /**
     * Find zero or one MidtransTransaction that matches the filter.
     * @param {MidtransTransactionFindUniqueArgs} args - Arguments to find a MidtransTransaction
     * @example
     * // Get one MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MidtransTransactionFindUniqueArgs>(args: SelectSubset<T, MidtransTransactionFindUniqueArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MidtransTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MidtransTransactionFindUniqueOrThrowArgs} args - Arguments to find a MidtransTransaction
     * @example
     * // Get one MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MidtransTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, MidtransTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MidtransTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionFindFirstArgs} args - Arguments to find a MidtransTransaction
     * @example
     * // Get one MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MidtransTransactionFindFirstArgs>(args?: SelectSubset<T, MidtransTransactionFindFirstArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MidtransTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionFindFirstOrThrowArgs} args - Arguments to find a MidtransTransaction
     * @example
     * // Get one MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MidtransTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, MidtransTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MidtransTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MidtransTransactions
     * const midtransTransactions = await prisma.midtransTransaction.findMany()
     * 
     * // Get first 10 MidtransTransactions
     * const midtransTransactions = await prisma.midtransTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const midtransTransactionWithIdOnly = await prisma.midtransTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MidtransTransactionFindManyArgs>(args?: SelectSubset<T, MidtransTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MidtransTransaction.
     * @param {MidtransTransactionCreateArgs} args - Arguments to create a MidtransTransaction.
     * @example
     * // Create one MidtransTransaction
     * const MidtransTransaction = await prisma.midtransTransaction.create({
     *   data: {
     *     // ... data to create a MidtransTransaction
     *   }
     * })
     * 
     */
    create<T extends MidtransTransactionCreateArgs>(args: SelectSubset<T, MidtransTransactionCreateArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MidtransTransactions.
     * @param {MidtransTransactionCreateManyArgs} args - Arguments to create many MidtransTransactions.
     * @example
     * // Create many MidtransTransactions
     * const midtransTransaction = await prisma.midtransTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MidtransTransactionCreateManyArgs>(args?: SelectSubset<T, MidtransTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MidtransTransactions and returns the data saved in the database.
     * @param {MidtransTransactionCreateManyAndReturnArgs} args - Arguments to create many MidtransTransactions.
     * @example
     * // Create many MidtransTransactions
     * const midtransTransaction = await prisma.midtransTransaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MidtransTransactions and only return the `id`
     * const midtransTransactionWithIdOnly = await prisma.midtransTransaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MidtransTransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, MidtransTransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MidtransTransaction.
     * @param {MidtransTransactionDeleteArgs} args - Arguments to delete one MidtransTransaction.
     * @example
     * // Delete one MidtransTransaction
     * const MidtransTransaction = await prisma.midtransTransaction.delete({
     *   where: {
     *     // ... filter to delete one MidtransTransaction
     *   }
     * })
     * 
     */
    delete<T extends MidtransTransactionDeleteArgs>(args: SelectSubset<T, MidtransTransactionDeleteArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MidtransTransaction.
     * @param {MidtransTransactionUpdateArgs} args - Arguments to update one MidtransTransaction.
     * @example
     * // Update one MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MidtransTransactionUpdateArgs>(args: SelectSubset<T, MidtransTransactionUpdateArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MidtransTransactions.
     * @param {MidtransTransactionDeleteManyArgs} args - Arguments to filter MidtransTransactions to delete.
     * @example
     * // Delete a few MidtransTransactions
     * const { count } = await prisma.midtransTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MidtransTransactionDeleteManyArgs>(args?: SelectSubset<T, MidtransTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MidtransTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MidtransTransactions
     * const midtransTransaction = await prisma.midtransTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MidtransTransactionUpdateManyArgs>(args: SelectSubset<T, MidtransTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MidtransTransactions and returns the data updated in the database.
     * @param {MidtransTransactionUpdateManyAndReturnArgs} args - Arguments to update many MidtransTransactions.
     * @example
     * // Update many MidtransTransactions
     * const midtransTransaction = await prisma.midtransTransaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MidtransTransactions and only return the `id`
     * const midtransTransactionWithIdOnly = await prisma.midtransTransaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MidtransTransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, MidtransTransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MidtransTransaction.
     * @param {MidtransTransactionUpsertArgs} args - Arguments to update or create a MidtransTransaction.
     * @example
     * // Update or create a MidtransTransaction
     * const midtransTransaction = await prisma.midtransTransaction.upsert({
     *   create: {
     *     // ... data to create a MidtransTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MidtransTransaction we want to update
     *   }
     * })
     */
    upsert<T extends MidtransTransactionUpsertArgs>(args: SelectSubset<T, MidtransTransactionUpsertArgs<ExtArgs>>): Prisma__MidtransTransactionClient<$Result.GetResult<Prisma.$MidtransTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MidtransTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionCountArgs} args - Arguments to filter MidtransTransactions to count.
     * @example
     * // Count the number of MidtransTransactions
     * const count = await prisma.midtransTransaction.count({
     *   where: {
     *     // ... the filter for the MidtransTransactions we want to count
     *   }
     * })
    **/
    count<T extends MidtransTransactionCountArgs>(
      args?: Subset<T, MidtransTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MidtransTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MidtransTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MidtransTransactionAggregateArgs>(args: Subset<T, MidtransTransactionAggregateArgs>): Prisma.PrismaPromise<GetMidtransTransactionAggregateType<T>>

    /**
     * Group by MidtransTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MidtransTransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MidtransTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MidtransTransactionGroupByArgs['orderBy'] }
        : { orderBy?: MidtransTransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MidtransTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMidtransTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MidtransTransaction model
   */
  readonly fields: MidtransTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MidtransTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MidtransTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transaksi<T extends TransaksiDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TransaksiDefaultArgs<ExtArgs>>): Prisma__TransaksiClient<$Result.GetResult<Prisma.$TransaksiPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MidtransTransaction model
   */
  interface MidtransTransactionFieldRefs {
    readonly id: FieldRef<"MidtransTransaction", 'String'>
    readonly orderId: FieldRef<"MidtransTransaction", 'String'>
    readonly transactionId: FieldRef<"MidtransTransaction", 'String'>
    readonly transaksiId: FieldRef<"MidtransTransaction", 'String'>
    readonly grossAmount: FieldRef<"MidtransTransaction", 'Int'>
    readonly paymentType: FieldRef<"MidtransTransaction", 'String'>
    readonly transactionStatus: FieldRef<"MidtransTransaction", 'String'>
    readonly fraudStatus: FieldRef<"MidtransTransaction", 'String'>
    readonly transactionTime: FieldRef<"MidtransTransaction", 'DateTime'>
    readonly settlementTime: FieldRef<"MidtransTransaction", 'DateTime'>
    readonly createdAt: FieldRef<"MidtransTransaction", 'DateTime'>
    readonly updatedAt: FieldRef<"MidtransTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MidtransTransaction findUnique
   */
  export type MidtransTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter, which MidtransTransaction to fetch.
     */
    where: MidtransTransactionWhereUniqueInput
  }

  /**
   * MidtransTransaction findUniqueOrThrow
   */
  export type MidtransTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter, which MidtransTransaction to fetch.
     */
    where: MidtransTransactionWhereUniqueInput
  }

  /**
   * MidtransTransaction findFirst
   */
  export type MidtransTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter, which MidtransTransaction to fetch.
     */
    where?: MidtransTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MidtransTransactions to fetch.
     */
    orderBy?: MidtransTransactionOrderByWithRelationInput | MidtransTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MidtransTransactions.
     */
    cursor?: MidtransTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MidtransTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MidtransTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MidtransTransactions.
     */
    distinct?: MidtransTransactionScalarFieldEnum | MidtransTransactionScalarFieldEnum[]
  }

  /**
   * MidtransTransaction findFirstOrThrow
   */
  export type MidtransTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter, which MidtransTransaction to fetch.
     */
    where?: MidtransTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MidtransTransactions to fetch.
     */
    orderBy?: MidtransTransactionOrderByWithRelationInput | MidtransTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MidtransTransactions.
     */
    cursor?: MidtransTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MidtransTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MidtransTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MidtransTransactions.
     */
    distinct?: MidtransTransactionScalarFieldEnum | MidtransTransactionScalarFieldEnum[]
  }

  /**
   * MidtransTransaction findMany
   */
  export type MidtransTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter, which MidtransTransactions to fetch.
     */
    where?: MidtransTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MidtransTransactions to fetch.
     */
    orderBy?: MidtransTransactionOrderByWithRelationInput | MidtransTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MidtransTransactions.
     */
    cursor?: MidtransTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MidtransTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MidtransTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MidtransTransactions.
     */
    distinct?: MidtransTransactionScalarFieldEnum | MidtransTransactionScalarFieldEnum[]
  }

  /**
   * MidtransTransaction create
   */
  export type MidtransTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a MidtransTransaction.
     */
    data: XOR<MidtransTransactionCreateInput, MidtransTransactionUncheckedCreateInput>
  }

  /**
   * MidtransTransaction createMany
   */
  export type MidtransTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MidtransTransactions.
     */
    data: MidtransTransactionCreateManyInput | MidtransTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MidtransTransaction createManyAndReturn
   */
  export type MidtransTransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * The data used to create many MidtransTransactions.
     */
    data: MidtransTransactionCreateManyInput | MidtransTransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MidtransTransaction update
   */
  export type MidtransTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a MidtransTransaction.
     */
    data: XOR<MidtransTransactionUpdateInput, MidtransTransactionUncheckedUpdateInput>
    /**
     * Choose, which MidtransTransaction to update.
     */
    where: MidtransTransactionWhereUniqueInput
  }

  /**
   * MidtransTransaction updateMany
   */
  export type MidtransTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MidtransTransactions.
     */
    data: XOR<MidtransTransactionUpdateManyMutationInput, MidtransTransactionUncheckedUpdateManyInput>
    /**
     * Filter which MidtransTransactions to update
     */
    where?: MidtransTransactionWhereInput
    /**
     * Limit how many MidtransTransactions to update.
     */
    limit?: number
  }

  /**
   * MidtransTransaction updateManyAndReturn
   */
  export type MidtransTransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * The data used to update MidtransTransactions.
     */
    data: XOR<MidtransTransactionUpdateManyMutationInput, MidtransTransactionUncheckedUpdateManyInput>
    /**
     * Filter which MidtransTransactions to update
     */
    where?: MidtransTransactionWhereInput
    /**
     * Limit how many MidtransTransactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MidtransTransaction upsert
   */
  export type MidtransTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the MidtransTransaction to update in case it exists.
     */
    where: MidtransTransactionWhereUniqueInput
    /**
     * In case the MidtransTransaction found by the `where` argument doesn't exist, create a new MidtransTransaction with this data.
     */
    create: XOR<MidtransTransactionCreateInput, MidtransTransactionUncheckedCreateInput>
    /**
     * In case the MidtransTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MidtransTransactionUpdateInput, MidtransTransactionUncheckedUpdateInput>
  }

  /**
   * MidtransTransaction delete
   */
  export type MidtransTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
    /**
     * Filter which MidtransTransaction to delete.
     */
    where: MidtransTransactionWhereUniqueInput
  }

  /**
   * MidtransTransaction deleteMany
   */
  export type MidtransTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MidtransTransactions to delete
     */
    where?: MidtransTransactionWhereInput
    /**
     * Limit how many MidtransTransactions to delete.
     */
    limit?: number
  }

  /**
   * MidtransTransaction without action
   */
  export type MidtransTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MidtransTransaction
     */
    select?: MidtransTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MidtransTransaction
     */
    omit?: MidtransTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MidtransTransactionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    role: 'role',
    banned: 'banned',
    banReason: 'banReason',
    banExpires: 'banExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const SantriScalarFieldEnum: {
    id: 'id',
    nis: 'nis',
    nama: 'nama',
    kelas: 'kelas',
    asrama: 'asrama',
    wali: 'wali',
    status: 'status',
    beasiswa: 'beasiswa',
    jenisBeasiswa: 'jenisBeasiswa',
    jenisSantri: 'jenisSantri',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SantriScalarFieldEnum = (typeof SantriScalarFieldEnum)[keyof typeof SantriScalarFieldEnum]


  export const TagihanScalarFieldEnum: {
    id: 'id',
    kode: 'kode',
    santriId: 'santriId',
    jenis: 'jenis',
    bulan: 'bulan',
    tahun: 'tahun',
    jumlah: 'jumlah',
    status: 'status',
    jatuhTempo: 'jatuhTempo',
    transaksiId: 'transaksiId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TagihanScalarFieldEnum = (typeof TagihanScalarFieldEnum)[keyof typeof TagihanScalarFieldEnum]


  export const TransaksiScalarFieldEnum: {
    id: 'id',
    kode: 'kode',
    santriId: 'santriId',
    jenis: 'jenis',
    bulan: 'bulan',
    periodePembayaran: 'periodePembayaran',
    tahun: 'tahun',
    jumlah: 'jumlah',
    tanggalBayar: 'tanggalBayar',
    status: 'status',
    statusUangSaku: 'statusUangSaku',
    jenisLaundry: 'jenisLaundry',
    keterangan: 'keterangan',
    managedBy: 'managedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransaksiScalarFieldEnum = (typeof TransaksiScalarFieldEnum)[keyof typeof TransaksiScalarFieldEnum]


  export const MidtransTransactionScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    transactionId: 'transactionId',
    transaksiId: 'transaksiId',
    grossAmount: 'grossAmount',
    paymentType: 'paymentType',
    transactionStatus: 'transactionStatus',
    fraudStatus: 'fraudStatus',
    transactionTime: 'transactionTime',
    settlementTime: 'settlementTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MidtransTransactionScalarFieldEnum = (typeof MidtransTransactionScalarFieldEnum)[keyof typeof MidtransTransactionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'StatusSantri'
   */
  export type EnumStatusSantriFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSantri'>
    


  /**
   * Reference to a field of type 'StatusSantri[]'
   */
  export type ListEnumStatusSantriFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusSantri[]'>
    


  /**
   * Reference to a field of type 'JenisBeasiswa'
   */
  export type EnumJenisBeasiswaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisBeasiswa'>
    


  /**
   * Reference to a field of type 'JenisBeasiswa[]'
   */
  export type ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisBeasiswa[]'>
    


  /**
   * Reference to a field of type 'JenisSantri'
   */
  export type EnumJenisSantriFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisSantri'>
    


  /**
   * Reference to a field of type 'JenisSantri[]'
   */
  export type ListEnumJenisSantriFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisSantri[]'>
    


  /**
   * Reference to a field of type 'JenisTagihan'
   */
  export type EnumJenisTagihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTagihan'>
    


  /**
   * Reference to a field of type 'JenisTagihan[]'
   */
  export type ListEnumJenisTagihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTagihan[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'StatusTagihan'
   */
  export type EnumStatusTagihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTagihan'>
    


  /**
   * Reference to a field of type 'StatusTagihan[]'
   */
  export type ListEnumStatusTagihanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTagihan[]'>
    


  /**
   * Reference to a field of type 'JenisTransaksi'
   */
  export type EnumJenisTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTransaksi'>
    


  /**
   * Reference to a field of type 'JenisTransaksi[]'
   */
  export type ListEnumJenisTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JenisTransaksi[]'>
    


  /**
   * Reference to a field of type 'PeriodePembayaran'
   */
  export type EnumPeriodePembayaranFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PeriodePembayaran'>
    


  /**
   * Reference to a field of type 'PeriodePembayaran[]'
   */
  export type ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PeriodePembayaran[]'>
    


  /**
   * Reference to a field of type 'StatusTransaksi'
   */
  export type EnumStatusTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTransaksi'>
    


  /**
   * Reference to a field of type 'StatusTransaksi[]'
   */
  export type ListEnumStatusTransaksiFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusTransaksi[]'>
    


  /**
   * Reference to a field of type 'StatusUangSaku'
   */
  export type EnumStatusUangSakuFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusUangSaku'>
    


  /**
   * Reference to a field of type 'StatusUangSaku[]'
   */
  export type ListEnumStatusUangSakuFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StatusUangSaku[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    santri?: XOR<SantriNullableScalarRelationFilter, SantriWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    santri?: SantriOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    santri?: XOR<SantriNullableScalarRelationFilter, SantriWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    banned?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    banReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    banExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type SantriWhereInput = {
    AND?: SantriWhereInput | SantriWhereInput[]
    OR?: SantriWhereInput[]
    NOT?: SantriWhereInput | SantriWhereInput[]
    id?: StringFilter<"Santri"> | string
    nis?: StringFilter<"Santri"> | string
    nama?: StringFilter<"Santri"> | string
    kelas?: StringFilter<"Santri"> | string
    asrama?: StringFilter<"Santri"> | string
    wali?: StringFilter<"Santri"> | string
    status?: EnumStatusSantriFilter<"Santri"> | $Enums.StatusSantri
    beasiswa?: BoolFilter<"Santri"> | boolean
    jenisBeasiswa?: EnumJenisBeasiswaNullableFilter<"Santri"> | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFilter<"Santri"> | $Enums.JenisSantri
    userId?: StringNullableFilter<"Santri"> | string | null
    createdAt?: DateTimeFilter<"Santri"> | Date | string
    updatedAt?: DateTimeFilter<"Santri"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transaksi?: TransaksiListRelationFilter
    tagihan?: TagihanListRelationFilter
  }

  export type SantriOrderByWithRelationInput = {
    id?: SortOrder
    nis?: SortOrder
    nama?: SortOrder
    kelas?: SortOrder
    asrama?: SortOrder
    wali?: SortOrder
    status?: SortOrder
    beasiswa?: SortOrder
    jenisBeasiswa?: SortOrderInput | SortOrder
    jenisSantri?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    transaksi?: TransaksiOrderByRelationAggregateInput
    tagihan?: TagihanOrderByRelationAggregateInput
  }

  export type SantriWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nis?: string
    userId?: string
    AND?: SantriWhereInput | SantriWhereInput[]
    OR?: SantriWhereInput[]
    NOT?: SantriWhereInput | SantriWhereInput[]
    nama?: StringFilter<"Santri"> | string
    kelas?: StringFilter<"Santri"> | string
    asrama?: StringFilter<"Santri"> | string
    wali?: StringFilter<"Santri"> | string
    status?: EnumStatusSantriFilter<"Santri"> | $Enums.StatusSantri
    beasiswa?: BoolFilter<"Santri"> | boolean
    jenisBeasiswa?: EnumJenisBeasiswaNullableFilter<"Santri"> | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFilter<"Santri"> | $Enums.JenisSantri
    createdAt?: DateTimeFilter<"Santri"> | Date | string
    updatedAt?: DateTimeFilter<"Santri"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transaksi?: TransaksiListRelationFilter
    tagihan?: TagihanListRelationFilter
  }, "id" | "nis" | "userId">

  export type SantriOrderByWithAggregationInput = {
    id?: SortOrder
    nis?: SortOrder
    nama?: SortOrder
    kelas?: SortOrder
    asrama?: SortOrder
    wali?: SortOrder
    status?: SortOrder
    beasiswa?: SortOrder
    jenisBeasiswa?: SortOrderInput | SortOrder
    jenisSantri?: SortOrder
    userId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SantriCountOrderByAggregateInput
    _max?: SantriMaxOrderByAggregateInput
    _min?: SantriMinOrderByAggregateInput
  }

  export type SantriScalarWhereWithAggregatesInput = {
    AND?: SantriScalarWhereWithAggregatesInput | SantriScalarWhereWithAggregatesInput[]
    OR?: SantriScalarWhereWithAggregatesInput[]
    NOT?: SantriScalarWhereWithAggregatesInput | SantriScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Santri"> | string
    nis?: StringWithAggregatesFilter<"Santri"> | string
    nama?: StringWithAggregatesFilter<"Santri"> | string
    kelas?: StringWithAggregatesFilter<"Santri"> | string
    asrama?: StringWithAggregatesFilter<"Santri"> | string
    wali?: StringWithAggregatesFilter<"Santri"> | string
    status?: EnumStatusSantriWithAggregatesFilter<"Santri"> | $Enums.StatusSantri
    beasiswa?: BoolWithAggregatesFilter<"Santri"> | boolean
    jenisBeasiswa?: EnumJenisBeasiswaNullableWithAggregatesFilter<"Santri"> | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriWithAggregatesFilter<"Santri"> | $Enums.JenisSantri
    userId?: StringNullableWithAggregatesFilter<"Santri"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Santri"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Santri"> | Date | string
  }

  export type TagihanWhereInput = {
    AND?: TagihanWhereInput | TagihanWhereInput[]
    OR?: TagihanWhereInput[]
    NOT?: TagihanWhereInput | TagihanWhereInput[]
    id?: StringFilter<"Tagihan"> | string
    kode?: StringFilter<"Tagihan"> | string
    santriId?: StringFilter<"Tagihan"> | string
    jenis?: EnumJenisTagihanFilter<"Tagihan"> | $Enums.JenisTagihan
    bulan?: StringFilter<"Tagihan"> | string
    tahun?: IntFilter<"Tagihan"> | number
    jumlah?: IntFilter<"Tagihan"> | number
    status?: EnumStatusTagihanFilter<"Tagihan"> | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFilter<"Tagihan"> | Date | string
    transaksiId?: StringNullableFilter<"Tagihan"> | string | null
    createdAt?: DateTimeFilter<"Tagihan"> | Date | string
    updatedAt?: DateTimeFilter<"Tagihan"> | Date | string
    santri?: XOR<SantriScalarRelationFilter, SantriWhereInput>
    transaksi?: XOR<TransaksiNullableScalarRelationFilter, TransaksiWhereInput> | null
  }

  export type TagihanOrderByWithRelationInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    status?: SortOrder
    jatuhTempo?: SortOrder
    transaksiId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    santri?: SantriOrderByWithRelationInput
    transaksi?: TransaksiOrderByWithRelationInput
  }

  export type TagihanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kode?: string
    santriId_jenis_bulan_tahun?: TagihanSantriIdJenisBulanTahunCompoundUniqueInput
    AND?: TagihanWhereInput | TagihanWhereInput[]
    OR?: TagihanWhereInput[]
    NOT?: TagihanWhereInput | TagihanWhereInput[]
    santriId?: StringFilter<"Tagihan"> | string
    jenis?: EnumJenisTagihanFilter<"Tagihan"> | $Enums.JenisTagihan
    bulan?: StringFilter<"Tagihan"> | string
    tahun?: IntFilter<"Tagihan"> | number
    jumlah?: IntFilter<"Tagihan"> | number
    status?: EnumStatusTagihanFilter<"Tagihan"> | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFilter<"Tagihan"> | Date | string
    transaksiId?: StringNullableFilter<"Tagihan"> | string | null
    createdAt?: DateTimeFilter<"Tagihan"> | Date | string
    updatedAt?: DateTimeFilter<"Tagihan"> | Date | string
    santri?: XOR<SantriScalarRelationFilter, SantriWhereInput>
    transaksi?: XOR<TransaksiNullableScalarRelationFilter, TransaksiWhereInput> | null
  }, "id" | "kode" | "santriId_jenis_bulan_tahun">

  export type TagihanOrderByWithAggregationInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    status?: SortOrder
    jatuhTempo?: SortOrder
    transaksiId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TagihanCountOrderByAggregateInput
    _avg?: TagihanAvgOrderByAggregateInput
    _max?: TagihanMaxOrderByAggregateInput
    _min?: TagihanMinOrderByAggregateInput
    _sum?: TagihanSumOrderByAggregateInput
  }

  export type TagihanScalarWhereWithAggregatesInput = {
    AND?: TagihanScalarWhereWithAggregatesInput | TagihanScalarWhereWithAggregatesInput[]
    OR?: TagihanScalarWhereWithAggregatesInput[]
    NOT?: TagihanScalarWhereWithAggregatesInput | TagihanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tagihan"> | string
    kode?: StringWithAggregatesFilter<"Tagihan"> | string
    santriId?: StringWithAggregatesFilter<"Tagihan"> | string
    jenis?: EnumJenisTagihanWithAggregatesFilter<"Tagihan"> | $Enums.JenisTagihan
    bulan?: StringWithAggregatesFilter<"Tagihan"> | string
    tahun?: IntWithAggregatesFilter<"Tagihan"> | number
    jumlah?: IntWithAggregatesFilter<"Tagihan"> | number
    status?: EnumStatusTagihanWithAggregatesFilter<"Tagihan"> | $Enums.StatusTagihan
    jatuhTempo?: DateTimeWithAggregatesFilter<"Tagihan"> | Date | string
    transaksiId?: StringNullableWithAggregatesFilter<"Tagihan"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tagihan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tagihan"> | Date | string
  }

  export type TransaksiWhereInput = {
    AND?: TransaksiWhereInput | TransaksiWhereInput[]
    OR?: TransaksiWhereInput[]
    NOT?: TransaksiWhereInput | TransaksiWhereInput[]
    id?: StringFilter<"Transaksi"> | string
    kode?: StringFilter<"Transaksi"> | string
    santriId?: StringFilter<"Transaksi"> | string
    jenis?: EnumJenisTransaksiFilter<"Transaksi"> | $Enums.JenisTransaksi
    bulan?: StringNullableFilter<"Transaksi"> | string | null
    periodePembayaran?: EnumPeriodePembayaranNullableFilter<"Transaksi"> | $Enums.PeriodePembayaran | null
    tahun?: IntNullableFilter<"Transaksi"> | number | null
    jumlah?: IntFilter<"Transaksi"> | number
    tanggalBayar?: DateTimeNullableFilter<"Transaksi"> | Date | string | null
    status?: EnumStatusTransaksiFilter<"Transaksi"> | $Enums.StatusTransaksi
    statusUangSaku?: EnumStatusUangSakuNullableFilter<"Transaksi"> | $Enums.StatusUangSaku | null
    jenisLaundry?: StringNullableFilter<"Transaksi"> | string | null
    keterangan?: StringNullableFilter<"Transaksi"> | string | null
    managedBy?: EnumRoleNullableFilter<"Transaksi"> | $Enums.Role | null
    createdAt?: DateTimeFilter<"Transaksi"> | Date | string
    updatedAt?: DateTimeFilter<"Transaksi"> | Date | string
    santri?: XOR<SantriScalarRelationFilter, SantriWhereInput>
    midtransTransactions?: MidtransTransactionListRelationFilter
    tagihan?: TagihanListRelationFilter
  }

  export type TransaksiOrderByWithRelationInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrderInput | SortOrder
    periodePembayaran?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    jumlah?: SortOrder
    tanggalBayar?: SortOrderInput | SortOrder
    status?: SortOrder
    statusUangSaku?: SortOrderInput | SortOrder
    jenisLaundry?: SortOrderInput | SortOrder
    keterangan?: SortOrderInput | SortOrder
    managedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    santri?: SantriOrderByWithRelationInput
    midtransTransactions?: MidtransTransactionOrderByRelationAggregateInput
    tagihan?: TagihanOrderByRelationAggregateInput
  }

  export type TransaksiWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kode?: string
    AND?: TransaksiWhereInput | TransaksiWhereInput[]
    OR?: TransaksiWhereInput[]
    NOT?: TransaksiWhereInput | TransaksiWhereInput[]
    santriId?: StringFilter<"Transaksi"> | string
    jenis?: EnumJenisTransaksiFilter<"Transaksi"> | $Enums.JenisTransaksi
    bulan?: StringNullableFilter<"Transaksi"> | string | null
    periodePembayaran?: EnumPeriodePembayaranNullableFilter<"Transaksi"> | $Enums.PeriodePembayaran | null
    tahun?: IntNullableFilter<"Transaksi"> | number | null
    jumlah?: IntFilter<"Transaksi"> | number
    tanggalBayar?: DateTimeNullableFilter<"Transaksi"> | Date | string | null
    status?: EnumStatusTransaksiFilter<"Transaksi"> | $Enums.StatusTransaksi
    statusUangSaku?: EnumStatusUangSakuNullableFilter<"Transaksi"> | $Enums.StatusUangSaku | null
    jenisLaundry?: StringNullableFilter<"Transaksi"> | string | null
    keterangan?: StringNullableFilter<"Transaksi"> | string | null
    managedBy?: EnumRoleNullableFilter<"Transaksi"> | $Enums.Role | null
    createdAt?: DateTimeFilter<"Transaksi"> | Date | string
    updatedAt?: DateTimeFilter<"Transaksi"> | Date | string
    santri?: XOR<SantriScalarRelationFilter, SantriWhereInput>
    midtransTransactions?: MidtransTransactionListRelationFilter
    tagihan?: TagihanListRelationFilter
  }, "id" | "kode">

  export type TransaksiOrderByWithAggregationInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrderInput | SortOrder
    periodePembayaran?: SortOrderInput | SortOrder
    tahun?: SortOrderInput | SortOrder
    jumlah?: SortOrder
    tanggalBayar?: SortOrderInput | SortOrder
    status?: SortOrder
    statusUangSaku?: SortOrderInput | SortOrder
    jenisLaundry?: SortOrderInput | SortOrder
    keterangan?: SortOrderInput | SortOrder
    managedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransaksiCountOrderByAggregateInput
    _avg?: TransaksiAvgOrderByAggregateInput
    _max?: TransaksiMaxOrderByAggregateInput
    _min?: TransaksiMinOrderByAggregateInput
    _sum?: TransaksiSumOrderByAggregateInput
  }

  export type TransaksiScalarWhereWithAggregatesInput = {
    AND?: TransaksiScalarWhereWithAggregatesInput | TransaksiScalarWhereWithAggregatesInput[]
    OR?: TransaksiScalarWhereWithAggregatesInput[]
    NOT?: TransaksiScalarWhereWithAggregatesInput | TransaksiScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaksi"> | string
    kode?: StringWithAggregatesFilter<"Transaksi"> | string
    santriId?: StringWithAggregatesFilter<"Transaksi"> | string
    jenis?: EnumJenisTransaksiWithAggregatesFilter<"Transaksi"> | $Enums.JenisTransaksi
    bulan?: StringNullableWithAggregatesFilter<"Transaksi"> | string | null
    periodePembayaran?: EnumPeriodePembayaranNullableWithAggregatesFilter<"Transaksi"> | $Enums.PeriodePembayaran | null
    tahun?: IntNullableWithAggregatesFilter<"Transaksi"> | number | null
    jumlah?: IntWithAggregatesFilter<"Transaksi"> | number
    tanggalBayar?: DateTimeNullableWithAggregatesFilter<"Transaksi"> | Date | string | null
    status?: EnumStatusTransaksiWithAggregatesFilter<"Transaksi"> | $Enums.StatusTransaksi
    statusUangSaku?: EnumStatusUangSakuNullableWithAggregatesFilter<"Transaksi"> | $Enums.StatusUangSaku | null
    jenisLaundry?: StringNullableWithAggregatesFilter<"Transaksi"> | string | null
    keterangan?: StringNullableWithAggregatesFilter<"Transaksi"> | string | null
    managedBy?: EnumRoleNullableWithAggregatesFilter<"Transaksi"> | $Enums.Role | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaksi"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaksi"> | Date | string
  }

  export type MidtransTransactionWhereInput = {
    AND?: MidtransTransactionWhereInput | MidtransTransactionWhereInput[]
    OR?: MidtransTransactionWhereInput[]
    NOT?: MidtransTransactionWhereInput | MidtransTransactionWhereInput[]
    id?: StringFilter<"MidtransTransaction"> | string
    orderId?: StringFilter<"MidtransTransaction"> | string
    transactionId?: StringNullableFilter<"MidtransTransaction"> | string | null
    transaksiId?: StringFilter<"MidtransTransaction"> | string
    grossAmount?: IntFilter<"MidtransTransaction"> | number
    paymentType?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionStatus?: StringFilter<"MidtransTransaction"> | string
    fraudStatus?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    createdAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
    transaksi?: XOR<TransaksiScalarRelationFilter, TransaksiWhereInput>
  }

  export type MidtransTransactionOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    transaksiId?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrderInput | SortOrder
    transactionStatus?: SortOrder
    fraudStatus?: SortOrderInput | SortOrder
    transactionTime?: SortOrderInput | SortOrder
    settlementTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    transaksi?: TransaksiOrderByWithRelationInput
  }

  export type MidtransTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    orderId?: string
    transactionId?: string
    AND?: MidtransTransactionWhereInput | MidtransTransactionWhereInput[]
    OR?: MidtransTransactionWhereInput[]
    NOT?: MidtransTransactionWhereInput | MidtransTransactionWhereInput[]
    transaksiId?: StringFilter<"MidtransTransaction"> | string
    grossAmount?: IntFilter<"MidtransTransaction"> | number
    paymentType?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionStatus?: StringFilter<"MidtransTransaction"> | string
    fraudStatus?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    createdAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
    transaksi?: XOR<TransaksiScalarRelationFilter, TransaksiWhereInput>
  }, "id" | "orderId" | "transactionId">

  export type MidtransTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrderInput | SortOrder
    transaksiId?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrderInput | SortOrder
    transactionStatus?: SortOrder
    fraudStatus?: SortOrderInput | SortOrder
    transactionTime?: SortOrderInput | SortOrder
    settlementTime?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MidtransTransactionCountOrderByAggregateInput
    _avg?: MidtransTransactionAvgOrderByAggregateInput
    _max?: MidtransTransactionMaxOrderByAggregateInput
    _min?: MidtransTransactionMinOrderByAggregateInput
    _sum?: MidtransTransactionSumOrderByAggregateInput
  }

  export type MidtransTransactionScalarWhereWithAggregatesInput = {
    AND?: MidtransTransactionScalarWhereWithAggregatesInput | MidtransTransactionScalarWhereWithAggregatesInput[]
    OR?: MidtransTransactionScalarWhereWithAggregatesInput[]
    NOT?: MidtransTransactionScalarWhereWithAggregatesInput | MidtransTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MidtransTransaction"> | string
    orderId?: StringWithAggregatesFilter<"MidtransTransaction"> | string
    transactionId?: StringNullableWithAggregatesFilter<"MidtransTransaction"> | string | null
    transaksiId?: StringWithAggregatesFilter<"MidtransTransaction"> | string
    grossAmount?: IntWithAggregatesFilter<"MidtransTransaction"> | number
    paymentType?: StringNullableWithAggregatesFilter<"MidtransTransaction"> | string | null
    transactionStatus?: StringWithAggregatesFilter<"MidtransTransaction"> | string
    fraudStatus?: StringNullableWithAggregatesFilter<"MidtransTransaction"> | string | null
    transactionTime?: DateTimeNullableWithAggregatesFilter<"MidtransTransaction"> | Date | string | null
    settlementTime?: DateTimeNullableWithAggregatesFilter<"MidtransTransaction"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MidtransTransaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MidtransTransaction"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    santri?: SantriCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    santri?: SantriUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    santri?: SantriUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    santri?: SantriUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SantriCreateInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutSantriInput
    transaksi?: TransaksiCreateNestedManyWithoutSantriInput
    tagihan?: TagihanCreateNestedManyWithoutSantriInput
  }

  export type SantriUncheckedCreateInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi?: TransaksiUncheckedCreateNestedManyWithoutSantriInput
    tagihan?: TagihanUncheckedCreateNestedManyWithoutSantriInput
  }

  export type SantriUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutSantriNestedInput
    transaksi?: TransaksiUpdateManyWithoutSantriNestedInput
    tagihan?: TagihanUpdateManyWithoutSantriNestedInput
  }

  export type SantriUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUncheckedUpdateManyWithoutSantriNestedInput
    tagihan?: TagihanUncheckedUpdateManyWithoutSantriNestedInput
  }

  export type SantriCreateManyInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SantriUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SantriUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanCreateInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    santri: SantriCreateNestedOneWithoutTagihanInput
    transaksi?: TransaksiCreateNestedOneWithoutTagihanInput
  }

  export type TagihanUncheckedCreateInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    transaksiId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    santri?: SantriUpdateOneRequiredWithoutTagihanNestedInput
    transaksi?: TransaksiUpdateOneWithoutTagihanNestedInput
  }

  export type TagihanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksiId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanCreateManyInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    transaksiId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksiId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiCreateInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    santri: SantriCreateNestedOneWithoutTransaksiInput
    midtransTransactions?: MidtransTransactionCreateNestedManyWithoutTransaksiInput
    tagihan?: TagihanCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiUncheckedCreateInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    midtransTransactions?: MidtransTransactionUncheckedCreateNestedManyWithoutTransaksiInput
    tagihan?: TagihanUncheckedCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    santri?: SantriUpdateOneRequiredWithoutTransaksiNestedInput
    midtransTransactions?: MidtransTransactionUpdateManyWithoutTransaksiNestedInput
    tagihan?: TagihanUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    midtransTransactions?: MidtransTransactionUncheckedUpdateManyWithoutTransaksiNestedInput
    tagihan?: TagihanUncheckedUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiCreateManyInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaksiUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionCreateInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi: TransaksiCreateNestedOneWithoutMidtransTransactionsInput
  }

  export type MidtransTransactionUncheckedCreateInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    transaksiId: string
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MidtransTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUpdateOneRequiredWithoutMidtransTransactionsNestedInput
  }

  export type MidtransTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    transaksiId?: StringFieldUpdateOperationsInput | string
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionCreateManyInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    transaksiId: string
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MidtransTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    transaksiId?: StringFieldUpdateOperationsInput | string
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SantriNullableScalarRelationFilter = {
    is?: SantriWhereInput | null
    isNot?: SantriWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumStatusSantriFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSantri | EnumStatusSantriFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSantriFilter<$PrismaModel> | $Enums.StatusSantri
  }

  export type EnumJenisBeasiswaNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisBeasiswa | EnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    in?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    not?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel> | $Enums.JenisBeasiswa | null
  }

  export type EnumJenisSantriFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisSantri | EnumJenisSantriFieldRefInput<$PrismaModel>
    in?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisSantriFilter<$PrismaModel> | $Enums.JenisSantri
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TransaksiListRelationFilter = {
    every?: TransaksiWhereInput
    some?: TransaksiWhereInput
    none?: TransaksiWhereInput
  }

  export type TagihanListRelationFilter = {
    every?: TagihanWhereInput
    some?: TagihanWhereInput
    none?: TagihanWhereInput
  }

  export type TransaksiOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagihanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SantriCountOrderByAggregateInput = {
    id?: SortOrder
    nis?: SortOrder
    nama?: SortOrder
    kelas?: SortOrder
    asrama?: SortOrder
    wali?: SortOrder
    status?: SortOrder
    beasiswa?: SortOrder
    jenisBeasiswa?: SortOrder
    jenisSantri?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SantriMaxOrderByAggregateInput = {
    id?: SortOrder
    nis?: SortOrder
    nama?: SortOrder
    kelas?: SortOrder
    asrama?: SortOrder
    wali?: SortOrder
    status?: SortOrder
    beasiswa?: SortOrder
    jenisBeasiswa?: SortOrder
    jenisSantri?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SantriMinOrderByAggregateInput = {
    id?: SortOrder
    nis?: SortOrder
    nama?: SortOrder
    kelas?: SortOrder
    asrama?: SortOrder
    wali?: SortOrder
    status?: SortOrder
    beasiswa?: SortOrder
    jenisBeasiswa?: SortOrder
    jenisSantri?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumStatusSantriWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSantri | EnumStatusSantriFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSantriWithAggregatesFilter<$PrismaModel> | $Enums.StatusSantri
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusSantriFilter<$PrismaModel>
    _max?: NestedEnumStatusSantriFilter<$PrismaModel>
  }

  export type EnumJenisBeasiswaNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisBeasiswa | EnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    in?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    not?: NestedEnumJenisBeasiswaNullableWithAggregatesFilter<$PrismaModel> | $Enums.JenisBeasiswa | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel>
    _max?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel>
  }

  export type EnumJenisSantriWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisSantri | EnumJenisSantriFieldRefInput<$PrismaModel>
    in?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisSantriWithAggregatesFilter<$PrismaModel> | $Enums.JenisSantri
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisSantriFilter<$PrismaModel>
    _max?: NestedEnumJenisSantriFilter<$PrismaModel>
  }

  export type EnumJenisTagihanFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTagihan | EnumJenisTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTagihanFilter<$PrismaModel> | $Enums.JenisTagihan
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumStatusTagihanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTagihan | EnumStatusTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTagihanFilter<$PrismaModel> | $Enums.StatusTagihan
  }

  export type SantriScalarRelationFilter = {
    is?: SantriWhereInput
    isNot?: SantriWhereInput
  }

  export type TransaksiNullableScalarRelationFilter = {
    is?: TransaksiWhereInput | null
    isNot?: TransaksiWhereInput | null
  }

  export type TagihanSantriIdJenisBulanTahunCompoundUniqueInput = {
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
  }

  export type TagihanCountOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    status?: SortOrder
    jatuhTempo?: SortOrder
    transaksiId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagihanAvgOrderByAggregateInput = {
    tahun?: SortOrder
    jumlah?: SortOrder
  }

  export type TagihanMaxOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    status?: SortOrder
    jatuhTempo?: SortOrder
    transaksiId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagihanMinOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    status?: SortOrder
    jatuhTempo?: SortOrder
    transaksiId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TagihanSumOrderByAggregateInput = {
    tahun?: SortOrder
    jumlah?: SortOrder
  }

  export type EnumJenisTagihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTagihan | EnumJenisTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTagihanWithAggregatesFilter<$PrismaModel> | $Enums.JenisTagihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTagihanFilter<$PrismaModel>
    _max?: NestedEnumJenisTagihanFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumStatusTagihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTagihan | EnumStatusTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTagihanWithAggregatesFilter<$PrismaModel> | $Enums.StatusTagihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTagihanFilter<$PrismaModel>
    _max?: NestedEnumStatusTagihanFilter<$PrismaModel>
  }

  export type EnumJenisTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiFilter<$PrismaModel> | $Enums.JenisTransaksi
  }

  export type EnumPeriodePembayaranNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PeriodePembayaran | EnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    in?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel> | $Enums.PeriodePembayaran | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumStatusTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTransaksi | EnumStatusTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTransaksiFilter<$PrismaModel> | $Enums.StatusTransaksi
  }

  export type EnumStatusUangSakuNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusUangSaku | EnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    in?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    not?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel> | $Enums.StatusUangSaku | null
  }

  export type EnumRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null
  }

  export type MidtransTransactionListRelationFilter = {
    every?: MidtransTransactionWhereInput
    some?: MidtransTransactionWhereInput
    none?: MidtransTransactionWhereInput
  }

  export type MidtransTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransaksiCountOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    periodePembayaran?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    tanggalBayar?: SortOrder
    status?: SortOrder
    statusUangSaku?: SortOrder
    jenisLaundry?: SortOrder
    keterangan?: SortOrder
    managedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaksiAvgOrderByAggregateInput = {
    tahun?: SortOrder
    jumlah?: SortOrder
  }

  export type TransaksiMaxOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    periodePembayaran?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    tanggalBayar?: SortOrder
    status?: SortOrder
    statusUangSaku?: SortOrder
    jenisLaundry?: SortOrder
    keterangan?: SortOrder
    managedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaksiMinOrderByAggregateInput = {
    id?: SortOrder
    kode?: SortOrder
    santriId?: SortOrder
    jenis?: SortOrder
    bulan?: SortOrder
    periodePembayaran?: SortOrder
    tahun?: SortOrder
    jumlah?: SortOrder
    tanggalBayar?: SortOrder
    status?: SortOrder
    statusUangSaku?: SortOrder
    jenisLaundry?: SortOrder
    keterangan?: SortOrder
    managedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaksiSumOrderByAggregateInput = {
    tahun?: SortOrder
    jumlah?: SortOrder
  }

  export type EnumJenisTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.JenisTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTransaksiFilter<$PrismaModel>
    _max?: NestedEnumJenisTransaksiFilter<$PrismaModel>
  }

  export type EnumPeriodePembayaranNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PeriodePembayaran | EnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    in?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPeriodePembayaranNullableWithAggregatesFilter<$PrismaModel> | $Enums.PeriodePembayaran | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel>
    _max?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumStatusTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTransaksi | EnumStatusTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.StatusTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTransaksiFilter<$PrismaModel>
    _max?: NestedEnumStatusTransaksiFilter<$PrismaModel>
  }

  export type EnumStatusUangSakuNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusUangSaku | EnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    in?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    not?: NestedEnumStatusUangSakuNullableWithAggregatesFilter<$PrismaModel> | $Enums.StatusUangSaku | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel>
    _max?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel>
  }

  export type EnumRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.Role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumRoleNullableFilter<$PrismaModel>
  }

  export type TransaksiScalarRelationFilter = {
    is?: TransaksiWhereInput
    isNot?: TransaksiWhereInput
  }

  export type MidtransTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    transaksiId?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionStatus?: SortOrder
    fraudStatus?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MidtransTransactionAvgOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type MidtransTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    transaksiId?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionStatus?: SortOrder
    fraudStatus?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MidtransTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    transactionId?: SortOrder
    transaksiId?: SortOrder
    grossAmount?: SortOrder
    paymentType?: SortOrder
    transactionStatus?: SortOrder
    fraudStatus?: SortOrder
    transactionTime?: SortOrder
    settlementTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MidtransTransactionSumOrderByAggregateInput = {
    grossAmount?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SantriCreateNestedOneWithoutUserInput = {
    create?: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
    connectOrCreate?: SantriCreateOrConnectWithoutUserInput
    connect?: SantriWhereUniqueInput
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SantriUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
    connectOrCreate?: SantriCreateOrConnectWithoutUserInput
    connect?: SantriWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SantriUpdateOneWithoutUserNestedInput = {
    create?: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
    connectOrCreate?: SantriCreateOrConnectWithoutUserInput
    upsert?: SantriUpsertWithoutUserInput
    disconnect?: SantriWhereInput | boolean
    delete?: SantriWhereInput | boolean
    connect?: SantriWhereUniqueInput
    update?: XOR<XOR<SantriUpdateToOneWithWhereWithoutUserInput, SantriUpdateWithoutUserInput>, SantriUncheckedUpdateWithoutUserInput>
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SantriUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
    connectOrCreate?: SantriCreateOrConnectWithoutUserInput
    upsert?: SantriUpsertWithoutUserInput
    disconnect?: SantriWhereInput | boolean
    delete?: SantriWhereInput | boolean
    connect?: SantriWhereUniqueInput
    update?: XOR<XOR<SantriUpdateToOneWithWhereWithoutUserInput, SantriUpdateWithoutUserInput>, SantriUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSantriInput = {
    create?: XOR<UserCreateWithoutSantriInput, UserUncheckedCreateWithoutSantriInput>
    connectOrCreate?: UserCreateOrConnectWithoutSantriInput
    connect?: UserWhereUniqueInput
  }

  export type TransaksiCreateNestedManyWithoutSantriInput = {
    create?: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput> | TransaksiCreateWithoutSantriInput[] | TransaksiUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TransaksiCreateOrConnectWithoutSantriInput | TransaksiCreateOrConnectWithoutSantriInput[]
    createMany?: TransaksiCreateManySantriInputEnvelope
    connect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
  }

  export type TagihanCreateNestedManyWithoutSantriInput = {
    create?: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput> | TagihanCreateWithoutSantriInput[] | TagihanUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutSantriInput | TagihanCreateOrConnectWithoutSantriInput[]
    createMany?: TagihanCreateManySantriInputEnvelope
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
  }

  export type TransaksiUncheckedCreateNestedManyWithoutSantriInput = {
    create?: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput> | TransaksiCreateWithoutSantriInput[] | TransaksiUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TransaksiCreateOrConnectWithoutSantriInput | TransaksiCreateOrConnectWithoutSantriInput[]
    createMany?: TransaksiCreateManySantriInputEnvelope
    connect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
  }

  export type TagihanUncheckedCreateNestedManyWithoutSantriInput = {
    create?: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput> | TagihanCreateWithoutSantriInput[] | TagihanUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutSantriInput | TagihanCreateOrConnectWithoutSantriInput[]
    createMany?: TagihanCreateManySantriInputEnvelope
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
  }

  export type EnumStatusSantriFieldUpdateOperationsInput = {
    set?: $Enums.StatusSantri
  }

  export type NullableEnumJenisBeasiswaFieldUpdateOperationsInput = {
    set?: $Enums.JenisBeasiswa | null
  }

  export type EnumJenisSantriFieldUpdateOperationsInput = {
    set?: $Enums.JenisSantri
  }

  export type UserUpdateOneWithoutSantriNestedInput = {
    create?: XOR<UserCreateWithoutSantriInput, UserUncheckedCreateWithoutSantriInput>
    connectOrCreate?: UserCreateOrConnectWithoutSantriInput
    upsert?: UserUpsertWithoutSantriInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSantriInput, UserUpdateWithoutSantriInput>, UserUncheckedUpdateWithoutSantriInput>
  }

  export type TransaksiUpdateManyWithoutSantriNestedInput = {
    create?: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput> | TransaksiCreateWithoutSantriInput[] | TransaksiUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TransaksiCreateOrConnectWithoutSantriInput | TransaksiCreateOrConnectWithoutSantriInput[]
    upsert?: TransaksiUpsertWithWhereUniqueWithoutSantriInput | TransaksiUpsertWithWhereUniqueWithoutSantriInput[]
    createMany?: TransaksiCreateManySantriInputEnvelope
    set?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    disconnect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    delete?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    connect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    update?: TransaksiUpdateWithWhereUniqueWithoutSantriInput | TransaksiUpdateWithWhereUniqueWithoutSantriInput[]
    updateMany?: TransaksiUpdateManyWithWhereWithoutSantriInput | TransaksiUpdateManyWithWhereWithoutSantriInput[]
    deleteMany?: TransaksiScalarWhereInput | TransaksiScalarWhereInput[]
  }

  export type TagihanUpdateManyWithoutSantriNestedInput = {
    create?: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput> | TagihanCreateWithoutSantriInput[] | TagihanUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutSantriInput | TagihanCreateOrConnectWithoutSantriInput[]
    upsert?: TagihanUpsertWithWhereUniqueWithoutSantriInput | TagihanUpsertWithWhereUniqueWithoutSantriInput[]
    createMany?: TagihanCreateManySantriInputEnvelope
    set?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    disconnect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    delete?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    update?: TagihanUpdateWithWhereUniqueWithoutSantriInput | TagihanUpdateWithWhereUniqueWithoutSantriInput[]
    updateMany?: TagihanUpdateManyWithWhereWithoutSantriInput | TagihanUpdateManyWithWhereWithoutSantriInput[]
    deleteMany?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
  }

  export type TransaksiUncheckedUpdateManyWithoutSantriNestedInput = {
    create?: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput> | TransaksiCreateWithoutSantriInput[] | TransaksiUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TransaksiCreateOrConnectWithoutSantriInput | TransaksiCreateOrConnectWithoutSantriInput[]
    upsert?: TransaksiUpsertWithWhereUniqueWithoutSantriInput | TransaksiUpsertWithWhereUniqueWithoutSantriInput[]
    createMany?: TransaksiCreateManySantriInputEnvelope
    set?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    disconnect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    delete?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    connect?: TransaksiWhereUniqueInput | TransaksiWhereUniqueInput[]
    update?: TransaksiUpdateWithWhereUniqueWithoutSantriInput | TransaksiUpdateWithWhereUniqueWithoutSantriInput[]
    updateMany?: TransaksiUpdateManyWithWhereWithoutSantriInput | TransaksiUpdateManyWithWhereWithoutSantriInput[]
    deleteMany?: TransaksiScalarWhereInput | TransaksiScalarWhereInput[]
  }

  export type TagihanUncheckedUpdateManyWithoutSantriNestedInput = {
    create?: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput> | TagihanCreateWithoutSantriInput[] | TagihanUncheckedCreateWithoutSantriInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutSantriInput | TagihanCreateOrConnectWithoutSantriInput[]
    upsert?: TagihanUpsertWithWhereUniqueWithoutSantriInput | TagihanUpsertWithWhereUniqueWithoutSantriInput[]
    createMany?: TagihanCreateManySantriInputEnvelope
    set?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    disconnect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    delete?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    update?: TagihanUpdateWithWhereUniqueWithoutSantriInput | TagihanUpdateWithWhereUniqueWithoutSantriInput[]
    updateMany?: TagihanUpdateManyWithWhereWithoutSantriInput | TagihanUpdateManyWithWhereWithoutSantriInput[]
    deleteMany?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
  }

  export type SantriCreateNestedOneWithoutTagihanInput = {
    create?: XOR<SantriCreateWithoutTagihanInput, SantriUncheckedCreateWithoutTagihanInput>
    connectOrCreate?: SantriCreateOrConnectWithoutTagihanInput
    connect?: SantriWhereUniqueInput
  }

  export type TransaksiCreateNestedOneWithoutTagihanInput = {
    create?: XOR<TransaksiCreateWithoutTagihanInput, TransaksiUncheckedCreateWithoutTagihanInput>
    connectOrCreate?: TransaksiCreateOrConnectWithoutTagihanInput
    connect?: TransaksiWhereUniqueInput
  }

  export type EnumJenisTagihanFieldUpdateOperationsInput = {
    set?: $Enums.JenisTagihan
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumStatusTagihanFieldUpdateOperationsInput = {
    set?: $Enums.StatusTagihan
  }

  export type SantriUpdateOneRequiredWithoutTagihanNestedInput = {
    create?: XOR<SantriCreateWithoutTagihanInput, SantriUncheckedCreateWithoutTagihanInput>
    connectOrCreate?: SantriCreateOrConnectWithoutTagihanInput
    upsert?: SantriUpsertWithoutTagihanInput
    connect?: SantriWhereUniqueInput
    update?: XOR<XOR<SantriUpdateToOneWithWhereWithoutTagihanInput, SantriUpdateWithoutTagihanInput>, SantriUncheckedUpdateWithoutTagihanInput>
  }

  export type TransaksiUpdateOneWithoutTagihanNestedInput = {
    create?: XOR<TransaksiCreateWithoutTagihanInput, TransaksiUncheckedCreateWithoutTagihanInput>
    connectOrCreate?: TransaksiCreateOrConnectWithoutTagihanInput
    upsert?: TransaksiUpsertWithoutTagihanInput
    disconnect?: TransaksiWhereInput | boolean
    delete?: TransaksiWhereInput | boolean
    connect?: TransaksiWhereUniqueInput
    update?: XOR<XOR<TransaksiUpdateToOneWithWhereWithoutTagihanInput, TransaksiUpdateWithoutTagihanInput>, TransaksiUncheckedUpdateWithoutTagihanInput>
  }

  export type SantriCreateNestedOneWithoutTransaksiInput = {
    create?: XOR<SantriCreateWithoutTransaksiInput, SantriUncheckedCreateWithoutTransaksiInput>
    connectOrCreate?: SantriCreateOrConnectWithoutTransaksiInput
    connect?: SantriWhereUniqueInput
  }

  export type MidtransTransactionCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput> | MidtransTransactionCreateWithoutTransaksiInput[] | MidtransTransactionUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: MidtransTransactionCreateOrConnectWithoutTransaksiInput | MidtransTransactionCreateOrConnectWithoutTransaksiInput[]
    createMany?: MidtransTransactionCreateManyTransaksiInputEnvelope
    connect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
  }

  export type TagihanCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput> | TagihanCreateWithoutTransaksiInput[] | TagihanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutTransaksiInput | TagihanCreateOrConnectWithoutTransaksiInput[]
    createMany?: TagihanCreateManyTransaksiInputEnvelope
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
  }

  export type MidtransTransactionUncheckedCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput> | MidtransTransactionCreateWithoutTransaksiInput[] | MidtransTransactionUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: MidtransTransactionCreateOrConnectWithoutTransaksiInput | MidtransTransactionCreateOrConnectWithoutTransaksiInput[]
    createMany?: MidtransTransactionCreateManyTransaksiInputEnvelope
    connect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
  }

  export type TagihanUncheckedCreateNestedManyWithoutTransaksiInput = {
    create?: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput> | TagihanCreateWithoutTransaksiInput[] | TagihanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutTransaksiInput | TagihanCreateOrConnectWithoutTransaksiInput[]
    createMany?: TagihanCreateManyTransaksiInputEnvelope
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
  }

  export type EnumJenisTransaksiFieldUpdateOperationsInput = {
    set?: $Enums.JenisTransaksi
  }

  export type NullableEnumPeriodePembayaranFieldUpdateOperationsInput = {
    set?: $Enums.PeriodePembayaran | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumStatusTransaksiFieldUpdateOperationsInput = {
    set?: $Enums.StatusTransaksi
  }

  export type NullableEnumStatusUangSakuFieldUpdateOperationsInput = {
    set?: $Enums.StatusUangSaku | null
  }

  export type NullableEnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role | null
  }

  export type SantriUpdateOneRequiredWithoutTransaksiNestedInput = {
    create?: XOR<SantriCreateWithoutTransaksiInput, SantriUncheckedCreateWithoutTransaksiInput>
    connectOrCreate?: SantriCreateOrConnectWithoutTransaksiInput
    upsert?: SantriUpsertWithoutTransaksiInput
    connect?: SantriWhereUniqueInput
    update?: XOR<XOR<SantriUpdateToOneWithWhereWithoutTransaksiInput, SantriUpdateWithoutTransaksiInput>, SantriUncheckedUpdateWithoutTransaksiInput>
  }

  export type MidtransTransactionUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput> | MidtransTransactionCreateWithoutTransaksiInput[] | MidtransTransactionUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: MidtransTransactionCreateOrConnectWithoutTransaksiInput | MidtransTransactionCreateOrConnectWithoutTransaksiInput[]
    upsert?: MidtransTransactionUpsertWithWhereUniqueWithoutTransaksiInput | MidtransTransactionUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: MidtransTransactionCreateManyTransaksiInputEnvelope
    set?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    disconnect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    delete?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    connect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    update?: MidtransTransactionUpdateWithWhereUniqueWithoutTransaksiInput | MidtransTransactionUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: MidtransTransactionUpdateManyWithWhereWithoutTransaksiInput | MidtransTransactionUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: MidtransTransactionScalarWhereInput | MidtransTransactionScalarWhereInput[]
  }

  export type TagihanUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput> | TagihanCreateWithoutTransaksiInput[] | TagihanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutTransaksiInput | TagihanCreateOrConnectWithoutTransaksiInput[]
    upsert?: TagihanUpsertWithWhereUniqueWithoutTransaksiInput | TagihanUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: TagihanCreateManyTransaksiInputEnvelope
    set?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    disconnect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    delete?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    update?: TagihanUpdateWithWhereUniqueWithoutTransaksiInput | TagihanUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: TagihanUpdateManyWithWhereWithoutTransaksiInput | TagihanUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
  }

  export type MidtransTransactionUncheckedUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput> | MidtransTransactionCreateWithoutTransaksiInput[] | MidtransTransactionUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: MidtransTransactionCreateOrConnectWithoutTransaksiInput | MidtransTransactionCreateOrConnectWithoutTransaksiInput[]
    upsert?: MidtransTransactionUpsertWithWhereUniqueWithoutTransaksiInput | MidtransTransactionUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: MidtransTransactionCreateManyTransaksiInputEnvelope
    set?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    disconnect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    delete?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    connect?: MidtransTransactionWhereUniqueInput | MidtransTransactionWhereUniqueInput[]
    update?: MidtransTransactionUpdateWithWhereUniqueWithoutTransaksiInput | MidtransTransactionUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: MidtransTransactionUpdateManyWithWhereWithoutTransaksiInput | MidtransTransactionUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: MidtransTransactionScalarWhereInput | MidtransTransactionScalarWhereInput[]
  }

  export type TagihanUncheckedUpdateManyWithoutTransaksiNestedInput = {
    create?: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput> | TagihanCreateWithoutTransaksiInput[] | TagihanUncheckedCreateWithoutTransaksiInput[]
    connectOrCreate?: TagihanCreateOrConnectWithoutTransaksiInput | TagihanCreateOrConnectWithoutTransaksiInput[]
    upsert?: TagihanUpsertWithWhereUniqueWithoutTransaksiInput | TagihanUpsertWithWhereUniqueWithoutTransaksiInput[]
    createMany?: TagihanCreateManyTransaksiInputEnvelope
    set?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    disconnect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    delete?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    connect?: TagihanWhereUniqueInput | TagihanWhereUniqueInput[]
    update?: TagihanUpdateWithWhereUniqueWithoutTransaksiInput | TagihanUpdateWithWhereUniqueWithoutTransaksiInput[]
    updateMany?: TagihanUpdateManyWithWhereWithoutTransaksiInput | TagihanUpdateManyWithWhereWithoutTransaksiInput[]
    deleteMany?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
  }

  export type TransaksiCreateNestedOneWithoutMidtransTransactionsInput = {
    create?: XOR<TransaksiCreateWithoutMidtransTransactionsInput, TransaksiUncheckedCreateWithoutMidtransTransactionsInput>
    connectOrCreate?: TransaksiCreateOrConnectWithoutMidtransTransactionsInput
    connect?: TransaksiWhereUniqueInput
  }

  export type TransaksiUpdateOneRequiredWithoutMidtransTransactionsNestedInput = {
    create?: XOR<TransaksiCreateWithoutMidtransTransactionsInput, TransaksiUncheckedCreateWithoutMidtransTransactionsInput>
    connectOrCreate?: TransaksiCreateOrConnectWithoutMidtransTransactionsInput
    upsert?: TransaksiUpsertWithoutMidtransTransactionsInput
    connect?: TransaksiWhereUniqueInput
    update?: XOR<XOR<TransaksiUpdateToOneWithWhereWithoutMidtransTransactionsInput, TransaksiUpdateWithoutMidtransTransactionsInput>, TransaksiUncheckedUpdateWithoutMidtransTransactionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumStatusSantriFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSantri | EnumStatusSantriFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSantriFilter<$PrismaModel> | $Enums.StatusSantri
  }

  export type NestedEnumJenisBeasiswaNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisBeasiswa | EnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    in?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    not?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel> | $Enums.JenisBeasiswa | null
  }

  export type NestedEnumJenisSantriFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisSantri | EnumJenisSantriFieldRefInput<$PrismaModel>
    in?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisSantriFilter<$PrismaModel> | $Enums.JenisSantri
  }

  export type NestedEnumStatusSantriWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusSantri | EnumStatusSantriFieldRefInput<$PrismaModel>
    in?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusSantri[] | ListEnumStatusSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusSantriWithAggregatesFilter<$PrismaModel> | $Enums.StatusSantri
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusSantriFilter<$PrismaModel>
    _max?: NestedEnumStatusSantriFilter<$PrismaModel>
  }

  export type NestedEnumJenisBeasiswaNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisBeasiswa | EnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    in?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.JenisBeasiswa[] | ListEnumJenisBeasiswaFieldRefInput<$PrismaModel> | null
    not?: NestedEnumJenisBeasiswaNullableWithAggregatesFilter<$PrismaModel> | $Enums.JenisBeasiswa | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel>
    _max?: NestedEnumJenisBeasiswaNullableFilter<$PrismaModel>
  }

  export type NestedEnumJenisSantriWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisSantri | EnumJenisSantriFieldRefInput<$PrismaModel>
    in?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisSantri[] | ListEnumJenisSantriFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisSantriWithAggregatesFilter<$PrismaModel> | $Enums.JenisSantri
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisSantriFilter<$PrismaModel>
    _max?: NestedEnumJenisSantriFilter<$PrismaModel>
  }

  export type NestedEnumJenisTagihanFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTagihan | EnumJenisTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTagihanFilter<$PrismaModel> | $Enums.JenisTagihan
  }

  export type NestedEnumStatusTagihanFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTagihan | EnumStatusTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTagihanFilter<$PrismaModel> | $Enums.StatusTagihan
  }

  export type NestedEnumJenisTagihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTagihan | EnumJenisTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTagihan[] | ListEnumJenisTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTagihanWithAggregatesFilter<$PrismaModel> | $Enums.JenisTagihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTagihanFilter<$PrismaModel>
    _max?: NestedEnumJenisTagihanFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumStatusTagihanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTagihan | EnumStatusTagihanFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTagihan[] | ListEnumStatusTagihanFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTagihanWithAggregatesFilter<$PrismaModel> | $Enums.StatusTagihan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTagihanFilter<$PrismaModel>
    _max?: NestedEnumStatusTagihanFilter<$PrismaModel>
  }

  export type NestedEnumJenisTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiFilter<$PrismaModel> | $Enums.JenisTransaksi
  }

  export type NestedEnumPeriodePembayaranNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PeriodePembayaran | EnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    in?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel> | $Enums.PeriodePembayaran | null
  }

  export type NestedEnumStatusTransaksiFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTransaksi | EnumStatusTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTransaksiFilter<$PrismaModel> | $Enums.StatusTransaksi
  }

  export type NestedEnumStatusUangSakuNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusUangSaku | EnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    in?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    not?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel> | $Enums.StatusUangSaku | null
  }

  export type NestedEnumRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null
  }

  export type NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JenisTransaksi | EnumJenisTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.JenisTransaksi[] | ListEnumJenisTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumJenisTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.JenisTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJenisTransaksiFilter<$PrismaModel>
    _max?: NestedEnumJenisTransaksiFilter<$PrismaModel>
  }

  export type NestedEnumPeriodePembayaranNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PeriodePembayaran | EnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    in?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PeriodePembayaran[] | ListEnumPeriodePembayaranFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPeriodePembayaranNullableWithAggregatesFilter<$PrismaModel> | $Enums.PeriodePembayaran | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel>
    _max?: NestedEnumPeriodePembayaranNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumStatusTransaksiWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusTransaksi | EnumStatusTransaksiFieldRefInput<$PrismaModel>
    in?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    notIn?: $Enums.StatusTransaksi[] | ListEnumStatusTransaksiFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusTransaksiWithAggregatesFilter<$PrismaModel> | $Enums.StatusTransaksi
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusTransaksiFilter<$PrismaModel>
    _max?: NestedEnumStatusTransaksiFilter<$PrismaModel>
  }

  export type NestedEnumStatusUangSakuNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StatusUangSaku | EnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    in?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.StatusUangSaku[] | ListEnumStatusUangSakuFieldRefInput<$PrismaModel> | null
    not?: NestedEnumStatusUangSakuNullableWithAggregatesFilter<$PrismaModel> | $Enums.StatusUangSaku | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel>
    _max?: NestedEnumStatusUangSakuNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.Role | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumRoleNullableFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SantriCreateWithoutUserInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi?: TransaksiCreateNestedManyWithoutSantriInput
    tagihan?: TagihanCreateNestedManyWithoutSantriInput
  }

  export type SantriUncheckedCreateWithoutUserInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi?: TransaksiUncheckedCreateNestedManyWithoutSantriInput
    tagihan?: TagihanUncheckedCreateNestedManyWithoutSantriInput
  }

  export type SantriCreateOrConnectWithoutUserInput = {
    where: SantriWhereUniqueInput
    create: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SantriUpsertWithoutUserInput = {
    update: XOR<SantriUpdateWithoutUserInput, SantriUncheckedUpdateWithoutUserInput>
    create: XOR<SantriCreateWithoutUserInput, SantriUncheckedCreateWithoutUserInput>
    where?: SantriWhereInput
  }

  export type SantriUpdateToOneWithWhereWithoutUserInput = {
    where?: SantriWhereInput
    data: XOR<SantriUpdateWithoutUserInput, SantriUncheckedUpdateWithoutUserInput>
  }

  export type SantriUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUpdateManyWithoutSantriNestedInput
    tagihan?: TagihanUpdateManyWithoutSantriNestedInput
  }

  export type SantriUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUncheckedUpdateManyWithoutSantriNestedInput
    tagihan?: TagihanUncheckedUpdateManyWithoutSantriNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    santri?: SantriCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    santri?: SantriUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    santri?: SantriUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    santri?: SantriUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    santri?: SantriCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    santri?: SantriUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    santri?: SantriUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    santri?: SantriUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSantriInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSantriInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    role?: $Enums.Role
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSantriInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSantriInput, UserUncheckedCreateWithoutSantriInput>
  }

  export type TransaksiCreateWithoutSantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    midtransTransactions?: MidtransTransactionCreateNestedManyWithoutTransaksiInput
    tagihan?: TagihanCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiUncheckedCreateWithoutSantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    midtransTransactions?: MidtransTransactionUncheckedCreateNestedManyWithoutTransaksiInput
    tagihan?: TagihanUncheckedCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiCreateOrConnectWithoutSantriInput = {
    where: TransaksiWhereUniqueInput
    create: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput>
  }

  export type TransaksiCreateManySantriInputEnvelope = {
    data: TransaksiCreateManySantriInput | TransaksiCreateManySantriInput[]
    skipDuplicates?: boolean
  }

  export type TagihanCreateWithoutSantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi?: TransaksiCreateNestedOneWithoutTagihanInput
  }

  export type TagihanUncheckedCreateWithoutSantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    transaksiId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanCreateOrConnectWithoutSantriInput = {
    where: TagihanWhereUniqueInput
    create: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput>
  }

  export type TagihanCreateManySantriInputEnvelope = {
    data: TagihanCreateManySantriInput | TagihanCreateManySantriInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSantriInput = {
    update: XOR<UserUpdateWithoutSantriInput, UserUncheckedUpdateWithoutSantriInput>
    create: XOR<UserCreateWithoutSantriInput, UserUncheckedCreateWithoutSantriInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSantriInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSantriInput, UserUncheckedUpdateWithoutSantriInput>
  }

  export type UserUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransaksiUpsertWithWhereUniqueWithoutSantriInput = {
    where: TransaksiWhereUniqueInput
    update: XOR<TransaksiUpdateWithoutSantriInput, TransaksiUncheckedUpdateWithoutSantriInput>
    create: XOR<TransaksiCreateWithoutSantriInput, TransaksiUncheckedCreateWithoutSantriInput>
  }

  export type TransaksiUpdateWithWhereUniqueWithoutSantriInput = {
    where: TransaksiWhereUniqueInput
    data: XOR<TransaksiUpdateWithoutSantriInput, TransaksiUncheckedUpdateWithoutSantriInput>
  }

  export type TransaksiUpdateManyWithWhereWithoutSantriInput = {
    where: TransaksiScalarWhereInput
    data: XOR<TransaksiUpdateManyMutationInput, TransaksiUncheckedUpdateManyWithoutSantriInput>
  }

  export type TransaksiScalarWhereInput = {
    AND?: TransaksiScalarWhereInput | TransaksiScalarWhereInput[]
    OR?: TransaksiScalarWhereInput[]
    NOT?: TransaksiScalarWhereInput | TransaksiScalarWhereInput[]
    id?: StringFilter<"Transaksi"> | string
    kode?: StringFilter<"Transaksi"> | string
    santriId?: StringFilter<"Transaksi"> | string
    jenis?: EnumJenisTransaksiFilter<"Transaksi"> | $Enums.JenisTransaksi
    bulan?: StringNullableFilter<"Transaksi"> | string | null
    periodePembayaran?: EnumPeriodePembayaranNullableFilter<"Transaksi"> | $Enums.PeriodePembayaran | null
    tahun?: IntNullableFilter<"Transaksi"> | number | null
    jumlah?: IntFilter<"Transaksi"> | number
    tanggalBayar?: DateTimeNullableFilter<"Transaksi"> | Date | string | null
    status?: EnumStatusTransaksiFilter<"Transaksi"> | $Enums.StatusTransaksi
    statusUangSaku?: EnumStatusUangSakuNullableFilter<"Transaksi"> | $Enums.StatusUangSaku | null
    jenisLaundry?: StringNullableFilter<"Transaksi"> | string | null
    keterangan?: StringNullableFilter<"Transaksi"> | string | null
    managedBy?: EnumRoleNullableFilter<"Transaksi"> | $Enums.Role | null
    createdAt?: DateTimeFilter<"Transaksi"> | Date | string
    updatedAt?: DateTimeFilter<"Transaksi"> | Date | string
  }

  export type TagihanUpsertWithWhereUniqueWithoutSantriInput = {
    where: TagihanWhereUniqueInput
    update: XOR<TagihanUpdateWithoutSantriInput, TagihanUncheckedUpdateWithoutSantriInput>
    create: XOR<TagihanCreateWithoutSantriInput, TagihanUncheckedCreateWithoutSantriInput>
  }

  export type TagihanUpdateWithWhereUniqueWithoutSantriInput = {
    where: TagihanWhereUniqueInput
    data: XOR<TagihanUpdateWithoutSantriInput, TagihanUncheckedUpdateWithoutSantriInput>
  }

  export type TagihanUpdateManyWithWhereWithoutSantriInput = {
    where: TagihanScalarWhereInput
    data: XOR<TagihanUpdateManyMutationInput, TagihanUncheckedUpdateManyWithoutSantriInput>
  }

  export type TagihanScalarWhereInput = {
    AND?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
    OR?: TagihanScalarWhereInput[]
    NOT?: TagihanScalarWhereInput | TagihanScalarWhereInput[]
    id?: StringFilter<"Tagihan"> | string
    kode?: StringFilter<"Tagihan"> | string
    santriId?: StringFilter<"Tagihan"> | string
    jenis?: EnumJenisTagihanFilter<"Tagihan"> | $Enums.JenisTagihan
    bulan?: StringFilter<"Tagihan"> | string
    tahun?: IntFilter<"Tagihan"> | number
    jumlah?: IntFilter<"Tagihan"> | number
    status?: EnumStatusTagihanFilter<"Tagihan"> | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFilter<"Tagihan"> | Date | string
    transaksiId?: StringNullableFilter<"Tagihan"> | string | null
    createdAt?: DateTimeFilter<"Tagihan"> | Date | string
    updatedAt?: DateTimeFilter<"Tagihan"> | Date | string
  }

  export type SantriCreateWithoutTagihanInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutSantriInput
    transaksi?: TransaksiCreateNestedManyWithoutSantriInput
  }

  export type SantriUncheckedCreateWithoutTagihanInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transaksi?: TransaksiUncheckedCreateNestedManyWithoutSantriInput
  }

  export type SantriCreateOrConnectWithoutTagihanInput = {
    where: SantriWhereUniqueInput
    create: XOR<SantriCreateWithoutTagihanInput, SantriUncheckedCreateWithoutTagihanInput>
  }

  export type TransaksiCreateWithoutTagihanInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    santri: SantriCreateNestedOneWithoutTransaksiInput
    midtransTransactions?: MidtransTransactionCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiUncheckedCreateWithoutTagihanInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    midtransTransactions?: MidtransTransactionUncheckedCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiCreateOrConnectWithoutTagihanInput = {
    where: TransaksiWhereUniqueInput
    create: XOR<TransaksiCreateWithoutTagihanInput, TransaksiUncheckedCreateWithoutTagihanInput>
  }

  export type SantriUpsertWithoutTagihanInput = {
    update: XOR<SantriUpdateWithoutTagihanInput, SantriUncheckedUpdateWithoutTagihanInput>
    create: XOR<SantriCreateWithoutTagihanInput, SantriUncheckedCreateWithoutTagihanInput>
    where?: SantriWhereInput
  }

  export type SantriUpdateToOneWithWhereWithoutTagihanInput = {
    where?: SantriWhereInput
    data: XOR<SantriUpdateWithoutTagihanInput, SantriUncheckedUpdateWithoutTagihanInput>
  }

  export type SantriUpdateWithoutTagihanInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutSantriNestedInput
    transaksi?: TransaksiUpdateManyWithoutSantriNestedInput
  }

  export type SantriUncheckedUpdateWithoutTagihanInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUncheckedUpdateManyWithoutSantriNestedInput
  }

  export type TransaksiUpsertWithoutTagihanInput = {
    update: XOR<TransaksiUpdateWithoutTagihanInput, TransaksiUncheckedUpdateWithoutTagihanInput>
    create: XOR<TransaksiCreateWithoutTagihanInput, TransaksiUncheckedCreateWithoutTagihanInput>
    where?: TransaksiWhereInput
  }

  export type TransaksiUpdateToOneWithWhereWithoutTagihanInput = {
    where?: TransaksiWhereInput
    data: XOR<TransaksiUpdateWithoutTagihanInput, TransaksiUncheckedUpdateWithoutTagihanInput>
  }

  export type TransaksiUpdateWithoutTagihanInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    santri?: SantriUpdateOneRequiredWithoutTransaksiNestedInput
    midtransTransactions?: MidtransTransactionUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiUncheckedUpdateWithoutTagihanInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    midtransTransactions?: MidtransTransactionUncheckedUpdateManyWithoutTransaksiNestedInput
  }

  export type SantriCreateWithoutTransaksiInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutSantriInput
    tagihan?: TagihanCreateNestedManyWithoutSantriInput
  }

  export type SantriUncheckedCreateWithoutTransaksiInput = {
    id?: string
    nis: string
    nama: string
    kelas: string
    asrama: string
    wali: string
    status?: $Enums.StatusSantri
    beasiswa?: boolean
    jenisBeasiswa?: $Enums.JenisBeasiswa | null
    jenisSantri?: $Enums.JenisSantri
    userId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tagihan?: TagihanUncheckedCreateNestedManyWithoutSantriInput
  }

  export type SantriCreateOrConnectWithoutTransaksiInput = {
    where: SantriWhereUniqueInput
    create: XOR<SantriCreateWithoutTransaksiInput, SantriUncheckedCreateWithoutTransaksiInput>
  }

  export type MidtransTransactionCreateWithoutTransaksiInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MidtransTransactionUncheckedCreateWithoutTransaksiInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MidtransTransactionCreateOrConnectWithoutTransaksiInput = {
    where: MidtransTransactionWhereUniqueInput
    create: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput>
  }

  export type MidtransTransactionCreateManyTransaksiInputEnvelope = {
    data: MidtransTransactionCreateManyTransaksiInput | MidtransTransactionCreateManyTransaksiInput[]
    skipDuplicates?: boolean
  }

  export type TagihanCreateWithoutTransaksiInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    santri: SantriCreateNestedOneWithoutTagihanInput
  }

  export type TagihanUncheckedCreateWithoutTransaksiInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanCreateOrConnectWithoutTransaksiInput = {
    where: TagihanWhereUniqueInput
    create: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput>
  }

  export type TagihanCreateManyTransaksiInputEnvelope = {
    data: TagihanCreateManyTransaksiInput | TagihanCreateManyTransaksiInput[]
    skipDuplicates?: boolean
  }

  export type SantriUpsertWithoutTransaksiInput = {
    update: XOR<SantriUpdateWithoutTransaksiInput, SantriUncheckedUpdateWithoutTransaksiInput>
    create: XOR<SantriCreateWithoutTransaksiInput, SantriUncheckedCreateWithoutTransaksiInput>
    where?: SantriWhereInput
  }

  export type SantriUpdateToOneWithWhereWithoutTransaksiInput = {
    where?: SantriWhereInput
    data: XOR<SantriUpdateWithoutTransaksiInput, SantriUncheckedUpdateWithoutTransaksiInput>
  }

  export type SantriUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutSantriNestedInput
    tagihan?: TagihanUpdateManyWithoutSantriNestedInput
  }

  export type SantriUncheckedUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    nis?: StringFieldUpdateOperationsInput | string
    nama?: StringFieldUpdateOperationsInput | string
    kelas?: StringFieldUpdateOperationsInput | string
    asrama?: StringFieldUpdateOperationsInput | string
    wali?: StringFieldUpdateOperationsInput | string
    status?: EnumStatusSantriFieldUpdateOperationsInput | $Enums.StatusSantri
    beasiswa?: BoolFieldUpdateOperationsInput | boolean
    jenisBeasiswa?: NullableEnumJenisBeasiswaFieldUpdateOperationsInput | $Enums.JenisBeasiswa | null
    jenisSantri?: EnumJenisSantriFieldUpdateOperationsInput | $Enums.JenisSantri
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tagihan?: TagihanUncheckedUpdateManyWithoutSantriNestedInput
  }

  export type MidtransTransactionUpsertWithWhereUniqueWithoutTransaksiInput = {
    where: MidtransTransactionWhereUniqueInput
    update: XOR<MidtransTransactionUpdateWithoutTransaksiInput, MidtransTransactionUncheckedUpdateWithoutTransaksiInput>
    create: XOR<MidtransTransactionCreateWithoutTransaksiInput, MidtransTransactionUncheckedCreateWithoutTransaksiInput>
  }

  export type MidtransTransactionUpdateWithWhereUniqueWithoutTransaksiInput = {
    where: MidtransTransactionWhereUniqueInput
    data: XOR<MidtransTransactionUpdateWithoutTransaksiInput, MidtransTransactionUncheckedUpdateWithoutTransaksiInput>
  }

  export type MidtransTransactionUpdateManyWithWhereWithoutTransaksiInput = {
    where: MidtransTransactionScalarWhereInput
    data: XOR<MidtransTransactionUpdateManyMutationInput, MidtransTransactionUncheckedUpdateManyWithoutTransaksiInput>
  }

  export type MidtransTransactionScalarWhereInput = {
    AND?: MidtransTransactionScalarWhereInput | MidtransTransactionScalarWhereInput[]
    OR?: MidtransTransactionScalarWhereInput[]
    NOT?: MidtransTransactionScalarWhereInput | MidtransTransactionScalarWhereInput[]
    id?: StringFilter<"MidtransTransaction"> | string
    orderId?: StringFilter<"MidtransTransaction"> | string
    transactionId?: StringNullableFilter<"MidtransTransaction"> | string | null
    transaksiId?: StringFilter<"MidtransTransaction"> | string
    grossAmount?: IntFilter<"MidtransTransaction"> | number
    paymentType?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionStatus?: StringFilter<"MidtransTransaction"> | string
    fraudStatus?: StringNullableFilter<"MidtransTransaction"> | string | null
    transactionTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    settlementTime?: DateTimeNullableFilter<"MidtransTransaction"> | Date | string | null
    createdAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
    updatedAt?: DateTimeFilter<"MidtransTransaction"> | Date | string
  }

  export type TagihanUpsertWithWhereUniqueWithoutTransaksiInput = {
    where: TagihanWhereUniqueInput
    update: XOR<TagihanUpdateWithoutTransaksiInput, TagihanUncheckedUpdateWithoutTransaksiInput>
    create: XOR<TagihanCreateWithoutTransaksiInput, TagihanUncheckedCreateWithoutTransaksiInput>
  }

  export type TagihanUpdateWithWhereUniqueWithoutTransaksiInput = {
    where: TagihanWhereUniqueInput
    data: XOR<TagihanUpdateWithoutTransaksiInput, TagihanUncheckedUpdateWithoutTransaksiInput>
  }

  export type TagihanUpdateManyWithWhereWithoutTransaksiInput = {
    where: TagihanScalarWhereInput
    data: XOR<TagihanUpdateManyMutationInput, TagihanUncheckedUpdateManyWithoutTransaksiInput>
  }

  export type TransaksiCreateWithoutMidtransTransactionsInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    santri: SantriCreateNestedOneWithoutTransaksiInput
    tagihan?: TagihanCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiUncheckedCreateWithoutMidtransTransactionsInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tagihan?: TagihanUncheckedCreateNestedManyWithoutTransaksiInput
  }

  export type TransaksiCreateOrConnectWithoutMidtransTransactionsInput = {
    where: TransaksiWhereUniqueInput
    create: XOR<TransaksiCreateWithoutMidtransTransactionsInput, TransaksiUncheckedCreateWithoutMidtransTransactionsInput>
  }

  export type TransaksiUpsertWithoutMidtransTransactionsInput = {
    update: XOR<TransaksiUpdateWithoutMidtransTransactionsInput, TransaksiUncheckedUpdateWithoutMidtransTransactionsInput>
    create: XOR<TransaksiCreateWithoutMidtransTransactionsInput, TransaksiUncheckedCreateWithoutMidtransTransactionsInput>
    where?: TransaksiWhereInput
  }

  export type TransaksiUpdateToOneWithWhereWithoutMidtransTransactionsInput = {
    where?: TransaksiWhereInput
    data: XOR<TransaksiUpdateWithoutMidtransTransactionsInput, TransaksiUncheckedUpdateWithoutMidtransTransactionsInput>
  }

  export type TransaksiUpdateWithoutMidtransTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    santri?: SantriUpdateOneRequiredWithoutTransaksiNestedInput
    tagihan?: TagihanUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiUncheckedUpdateWithoutMidtransTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tagihan?: TagihanUncheckedUpdateManyWithoutTransaksiNestedInput
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaksiCreateManySantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTransaksi
    bulan?: string | null
    periodePembayaran?: $Enums.PeriodePembayaran | null
    tahun?: number | null
    jumlah: number
    tanggalBayar?: Date | string | null
    status?: $Enums.StatusTransaksi
    statusUangSaku?: $Enums.StatusUangSaku | null
    jenisLaundry?: string | null
    keterangan?: string | null
    managedBy?: $Enums.Role | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanCreateManySantriInput = {
    id?: string
    kode: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    transaksiId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaksiUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    midtransTransactions?: MidtransTransactionUpdateManyWithoutTransaksiNestedInput
    tagihan?: TagihanUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiUncheckedUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    midtransTransactions?: MidtransTransactionUncheckedUpdateManyWithoutTransaksiNestedInput
    tagihan?: TagihanUncheckedUpdateManyWithoutTransaksiNestedInput
  }

  export type TransaksiUncheckedUpdateManyWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTransaksiFieldUpdateOperationsInput | $Enums.JenisTransaksi
    bulan?: NullableStringFieldUpdateOperationsInput | string | null
    periodePembayaran?: NullableEnumPeriodePembayaranFieldUpdateOperationsInput | $Enums.PeriodePembayaran | null
    tahun?: NullableIntFieldUpdateOperationsInput | number | null
    jumlah?: IntFieldUpdateOperationsInput | number
    tanggalBayar?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumStatusTransaksiFieldUpdateOperationsInput | $Enums.StatusTransaksi
    statusUangSaku?: NullableEnumStatusUangSakuFieldUpdateOperationsInput | $Enums.StatusUangSaku | null
    jenisLaundry?: NullableStringFieldUpdateOperationsInput | string | null
    keterangan?: NullableStringFieldUpdateOperationsInput | string | null
    managedBy?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksi?: TransaksiUpdateOneWithoutTagihanNestedInput
  }

  export type TagihanUncheckedUpdateWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksiId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanUncheckedUpdateManyWithoutSantriInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    transaksiId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionCreateManyTransaksiInput = {
    id?: string
    orderId: string
    transactionId?: string | null
    grossAmount: number
    paymentType?: string | null
    transactionStatus: string
    fraudStatus?: string | null
    transactionTime?: Date | string | null
    settlementTime?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TagihanCreateManyTransaksiInput = {
    id?: string
    kode: string
    santriId: string
    jenis: $Enums.JenisTagihan
    bulan: string
    tahun: number
    jumlah: number
    status?: $Enums.StatusTagihan
    jatuhTempo: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MidtransTransactionUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionUncheckedUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MidtransTransactionUncheckedUpdateManyWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    transactionId?: NullableStringFieldUpdateOperationsInput | string | null
    grossAmount?: IntFieldUpdateOperationsInput | number
    paymentType?: NullableStringFieldUpdateOperationsInput | string | null
    transactionStatus?: StringFieldUpdateOperationsInput | string
    fraudStatus?: NullableStringFieldUpdateOperationsInput | string | null
    transactionTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settlementTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    santri?: SantriUpdateOneRequiredWithoutTagihanNestedInput
  }

  export type TagihanUncheckedUpdateWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagihanUncheckedUpdateManyWithoutTransaksiInput = {
    id?: StringFieldUpdateOperationsInput | string
    kode?: StringFieldUpdateOperationsInput | string
    santriId?: StringFieldUpdateOperationsInput | string
    jenis?: EnumJenisTagihanFieldUpdateOperationsInput | $Enums.JenisTagihan
    bulan?: StringFieldUpdateOperationsInput | string
    tahun?: IntFieldUpdateOperationsInput | number
    jumlah?: IntFieldUpdateOperationsInput | number
    status?: EnumStatusTagihanFieldUpdateOperationsInput | $Enums.StatusTagihan
    jatuhTempo?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}