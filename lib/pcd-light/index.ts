export interface PCD<C = unknown, P = unknown> {
  id: string;
  type: string;
  claim: C;
  proof: P;
}

export interface SerializedPCD<_T extends PCD = PCD> {
  type: string;
  pcd: string;
}

/**
 * This interface can be optionally returned by the package ƒor any given
 * PCD, which allows the package some degree of control over how the PCD
 * is displayed in the passport application.
 */
export interface DisplayOptions {
  /**
   * Shown to the user in the main page of the passport, where they can
   * see all of their cards. If `header` is undefined, the passport will use
   * `renderCardBody` with `returnHeader` set to true.
   */
  header?: string;

  /**
   * Shown to the user in the `GenericProveScreen`, allowing them to
   * disambiguate between different pcds of the same type. In the future,
   * we'll have a better way to disambiguate between them.
   */
  displayName?: string;
}

export interface PCDPackage<C = any, P = any, A = any, I = any> {
  name: string;
  getDisplayOptions?: (pcd: PCD<C, P>) => DisplayOptions;
  renderCardBody?: ({
    pcd,
    returnHeader,
  }: {
    pcd: PCD<C, P>;
    returnHeader?: boolean;
  }) => React.ReactElement;
  init?: (initArgs: I) => Promise<void>;
  prove(args: A): Promise<PCD<C, P>>;
  verify(pcd: PCD<C, P>): Promise<boolean>;
  serialize(pcd: PCD<C, P>): Promise<SerializedPCD<PCD<C, P>>>;
  deserialize(seralized: string): Promise<PCD<C, P>>;
}

export type ArgsOf<T> = T extends PCDPackage<any, any, infer U, any> ? U : T;

export enum PCDRequestType {
  Get = "Get",
  GetWithoutProving = "GetWithoutProving",
  Add = "Add",
  ProveAndAdd = "ProveAndAdd",
}

export interface PCDRequest {
  returnUrl: string;
  type: PCDRequestType;
}

export interface ProveOptions {
  genericProveScreen?: boolean;
  title?: string;
  description?: string;
  debug?: boolean;
  proveOnServer?: boolean;
  signIn?: boolean;
}

/**
 * When a website uses the passport for signing in, the passport
 * signs this payload using a `SemaphoreSignaturePCD`.
 */
export interface SignInMessagePayload {
  uuid: string;
  referrer: string;
}

export interface PCDGetRequest<T extends PCDPackage = PCDPackage>
  extends PCDRequest {
  type: PCDRequestType.Get;
  pcdType: T["name"];
  args: ArgsOf<T>;
  options?: ProveOptions;
}

export interface PCDGetWithoutProvingRequest extends PCDRequest {
  pcdType: string;
}

export interface PCDAddRequest extends PCDRequest {
  type: PCDRequestType.Add;
  pcd: SerializedPCD;
}

export interface PCDProveAndAddRequest<T extends PCDPackage = PCDPackage>
  extends PCDRequest {
  type: PCDRequestType.ProveAndAdd;
  pcdType: string;
  args: ArgsOf<T>;
  options?: ProveOptions;
  returnPCD?: boolean;
}

export function getWithoutProvingUrl(
  passportOrigin: string,
  returnUrl: string,
  pcdType: string,
) {
  const req: PCDGetWithoutProvingRequest = {
    type: PCDRequestType.GetWithoutProving,
    pcdType,
    returnUrl,
  };
  const encReq = encodeURIComponent(JSON.stringify(req));
  return `${passportOrigin}#/get-without-proving?request=${encReq}`;
}

export function constructPassportPcdGetRequestUrl<T extends PCDPackage>(
  passportOrigin: string,
  returnUrl: string,
  pcdType: T["name"],
  args: ArgsOf<T>,
  options?: ProveOptions,
) {
  const req: PCDGetRequest<T> = {
    type: PCDRequestType.Get,
    returnUrl: returnUrl,
    args: args,
    pcdType,
    options,
  };
  const encReq = encodeURIComponent(JSON.stringify(req));
  return `${passportOrigin}#/prove?request=${encReq}`;
}

export function constructPassportPcdAddRequestUrl(
  passportOrigin: string,
  returnUrl: string,
  pcd: SerializedPCD,
) {
  const req: PCDAddRequest = {
    type: PCDRequestType.Add,
    returnUrl: returnUrl,
    pcd,
  };
  const eqReq = encodeURIComponent(JSON.stringify(req));
  return `${passportOrigin}#/add?request=${eqReq}`;
}

export function constructPassportPcdProveAndAddRequestUrl<
  T extends PCDPackage = PCDPackage,
>(
  passportOrigin: string,
  returnUrl: string,
  pcdType: string,
  args: ArgsOf<T>,
  options?: ProveOptions,
  returnPCD?: boolean,
) {
  const req: PCDProveAndAddRequest = {
    type: PCDRequestType.ProveAndAdd,
    returnUrl: returnUrl,
    pcdType,
    args,
    options,
    returnPCD,
  };
  const eqReq = encodeURIComponent(JSON.stringify(req));
  return `${passportOrigin}#/add?request=${eqReq}`;
}

/**
 * Fields of the object passed into {@link PCDPackage.prove} can only represent
 * one of the following types. {@link Unknown} is included to be used in a similar
 * way as {@code unknown} is used in TypeScript.
 */
export enum ArgumentTypeName {
  String = "String",
  Number = "Number",
  BigInt = "BigInt",
  Boolean = "Boolean",
  Object = "Object",
  StringArray = "StringArray",
  PCD = "PCD",
  ToggleList = "ToggleList",
  Unknown = "Unknown",
}

/**
 * The globally unique type name of the {@link EdDSAPCD}.
 */
export const EdDSAPCDTypeName = "eddsa-pcd";
/**
 * An EdDSA public key is represented as a point on the elliptic curve, with each point being
 * a pair of coordinates consisting of hexadecimal strings. The public key is maintained in a standard
 * format and is internally converted to and from the Montgomery format as needed.
 */
export type EdDSAPublicKey = [string, string];
/**
 * Interface containing the arguments that 3rd parties use to
 * initialize this PCD package.
 * It is empty because this package does not implement the `init` function.
 */
export interface EdDSAInitArgs {}
/**
 * Defines the essential parameters required for creating an {@link EdDSAPCD}.
 */export 
type EdDSAPCDArgs = {
  /**
   * The EdDSA private key is a 32-byte value used to sign the message.
   * {@link newEdDSAPrivateKey} is recommended for generating highly secure private keys.
   */
  privateKey: StringArgument;
  /**
   * The message is composed of a list of stringified big integers so that both `proof` and `claim`
   * can also be used within SNARK circuits, which operate on fields that are themselves big integers.
   */
  message: StringArrayArgument;
  /**
   * A string that uniquely identifies an {@link EdDSAPCD}. If this argument is not specified a random
   * id will be generated.
   */
  id: StringArgument;
};
/**
 * Defines the EdDSA PCD claim. The claim contains a message signed
 * with the private key corresponding to the given public key.
 */
interface EdDSAPCDClaim {
  /**
   * An EdDSA public key corresponding to the EdDSA private key used
   * for signing the message.
   */
  publicKey: EdDSAPublicKey;
  /**
   * A list of big integers that were signed with the corresponding private key.
   */
  message: Array<bigint>;
}
/**
 * Defines the EdDSA PCD proof. The proof is the signature that proves
 * that the private key corresponding to the public key in the claim has been successfully
 * used to sign the message.
 */
interface EdDSAPCDProof {
  /**
   * The EdDSA signature of the message as a hexadecimal string.
   */
  signature: string;
}
/**
 * The EdDSA PCD enables the verification that a specific message has been signed with an
 * EdDSA private key. The {@link EdDSAPCDProof}, serving as the signature, is verified
 * using the {@link EdDSAPCDClaim}, which consists of the EdDSA public key and the message.
 */
declare class EdDSAPCD implements PCD<EdDSAPCDClaim, EdDSAPCDProof> {
  type: string;
  id: string;
  claim: EdDSAPCDClaim;
  proof: EdDSAPCDProof;
  constructor(id: string, claim: EdDSAPCDClaim, proof: EdDSAPCDProof);
}
/**
 * Creates a new {@link EdDSAPCD} by generating an {@link EdDSAPCDProof}
 * and deriving an {@link EdDSAPCDClaim} from the given {@link EdDSAPCDArgs}.
 */
declare function prove(args: EdDSAPCDArgs): Promise<EdDSAPCD>;
/**
 * Verifies an EdDSA PCD by checking that its {@link EdDSAPCDClaim} corresponds to its {@link EdDSAPCDProof}.
 * If they match, the function returns true, otherwise false.
 */
declare function verify(pcd: EdDSAPCD): Promise<boolean>;
/**
 * Serializes an {@link EdDSAPCD}.
 * @param pcd The EdDSA PCD to be serialized.
 * @returns The serialized version of the EdDSA PCD.
 */
declare function serialize(pcd: EdDSAPCD): Promise<SerializedPCD<EdDSAPCD>>;
/**
 * Deserializes a serialized {@link EdDSAPCD}.
 * @param serialized The serialized PCD to deserialize.
 * @returns The deserialized version of the EdDSA PCD.
 */
declare function deserialize(serialized: string): Promise<EdDSAPCD>;
/**
 * Provides the information about the {@link EdDSAPCD} that will be displayed
 * to users on Zupass.
 * @param pcd The EdDSA PCD instance.
 * @returns The information to be displayed, specifically `header` and `displayName`.
 */
declare function getDisplayOptions(pcd: EdDSAPCD): DisplayOptions;
/**
 * The PCD package of the EdDSA PCD. It exports an object containing
 * the code necessary to operate on this PCD data.
 */
export declare const EdDSAPCDPackage: PCDPackage<EdDSAPCDClaim, EdDSAPCDProof, EdDSAPCDArgs, EdDSAInitArgs>;

/**
 * Returns an {@link EdDSAPublicKey} derived from a 32-byte EdDSA private key.
 * The private key must be a hexadecimal string or a Uint8Array typed array.
 * @param privateKey The 32-byte EdDSA private key.
 * @returns The {@link EdDSAPublicKey} extracted from the private key.
 */
declare function getEdDSAPublicKey(
  privateKey: string | Uint8Array,
): Promise<EdDSAPublicKey>;

/**
 * Creates a new EdDSA private key generating a cryptographically strong random 32-byte value.
 */
declare function newEdDSAPrivateKey(): string;
/**
 * Compares two EdDSA public keys for equality.
 */
declare function isEqualEdDSAPublicKey(
  a: EdDSAPublicKey,
  b: EdDSAPublicKey,
): boolean;

/**
 * Each type of {@link PCD} has a corresponding {@link PCDPackage}. The
 * {@link PCDPackage} of a {@link PCD} type defines the code necessary to
 * derive meaning from and operate on the data within a {@link PCD}.
 *
 * @typeParam {@link C} the type of {@link PCD.claim} for the {@link PCD} encapsulated
 *   by this {@link PCDPackage}
 *
 * @typeParam {@link P} the type of {@link PCD.proof} for the {@link PCD} encapsulated
 *   by this {@link PCDPackage}
 *
 * @typeParam {@link A} - the type of the arguments passed into {@link PCDPackage#prove}
 *   to instantiate a new {@link PCD}. It is important that {@link A} can be serialized
 *   and deserialized using {@code JSON.stringify} {@code JSON.parse}, because these arguments
 *   should be able to be passed over the wire trivially. This may cause the type of {@link A}
 *   to be less convenient that desired. Eg. you may have to pass {@code BigInt}s in as strings,
 *   etc. Another important note about {@link A} is that each of its fields must implement the
 *   {@link Argument} interface. This is important because it enables Zupass to introspect the
 *   arguments, and to implement useful features like the {@code GenericProveScreen}, which is
 *   a screen that automatically builds a UI which lets a user input all the arguments required to
 *   instantiate a new instance of a particular {@link PCD} based on the request it gets from a
 *   third party.
 *
 * @typeparam {@link I} the type of the arguments passed into {@link PCDPackage#init}, if the
 *   init function is present to instantiate a new {@link PCD}
 */

/**
 * Given a type extending {@link PCDPackage}, extracts the type of {@link PCD} it
 * encapsulates.
 */
type PCDOf<T> = T extends PCDPackage<infer C, infer P, any, any>
  ? PCD<C, P>
  : T;
/**
 * This interface can be optionally returned by the package for any given
 * PCD, which allows the package some degree of control over how the PCD
 * is displayed in Zupass.
 */

type PCDTypeNameOf<T> = T extends PCDPackage<any, any, any, any>
  ? T["name"]
  : T;
interface ArgumentType<T extends ArgumentTypeName, U = unknown> {
  type: T;
  specificType: U;
}
interface Argument<
  TypeName extends ArgumentTypeName,
  ValueType = unknown,
  /**
   * This is the type of the params that are passed into the validator function
   * of the argument. It is important that this type is serializable and
   * deserializable using {@code JSON.stringify} and {@code JSON.parse}, because
   * these arguments should be able to be passed over the wire trivially.
   */
  ValidatorParams = Record<string, unknown>,
> {
  argumentType: TypeName;
  value?: ValueType;
  userProvided?: boolean;
  /**
   * Display name for the argument. If not provided, the {@link Argument} key is displayed in title case.
   */
  displayName?: string;
  /**
   * Tooltip text for the argument. If {@link displayName} is set to empty string, the tooltip text is displayed in line.
   */
  description?: string;
  /**
   * Can be used to hide certain advanced arguments from the UI by default.
   * Users can still reveal them by clicking the "show more" button. Defaults
   * to true.
   */
  defaultVisible?: boolean;
  /**
   * Whether to hide the icon left to the argument. Defaults to false.
   */
  hideIcon?: boolean;
  /**
   * Can be used to validate user input before proof generation as well as
   * proactive filtering of options, such as PCDs, in the UI.
   */
  validatorParams?: ValidatorParams;
}
/**
 * Fields of the object passed into {@link PCDPackage.prove} can only represent
 * one of the following types. {@link Unknown} is included to be used in a similar
 * way as {@code unknown} is used in TypeScript.
 */

type StringArgument = Argument<ArgumentTypeName.String, string>;
declare function isStringArgument(
  arg: Argument<any, unknown>,
): arg is StringArgument;
type NumberArgument = Argument<ArgumentTypeName.Number, string>;
declare function isNumberArgument(
  arg: Argument<any, unknown>,
): arg is NumberArgument;
type BigIntArgument = Argument<ArgumentTypeName.BigInt, string>;
declare function isBigIntArgument(
  arg: Argument<any, unknown>,
): arg is BigIntArgument;
type BooleanArgument = Argument<ArgumentTypeName.Boolean, boolean>;
declare function isBooleanArgument(
  arg: Argument<any, unknown>,
): arg is BooleanArgument;
type ObjectArgument<T> = Argument<ArgumentTypeName.Object, T> & {
  remoteUrl?: string;
};
declare function isObjectArgument(
  arg: Argument<any, unknown>,
): arg is ObjectArgument<unknown>;
type StringArrayArgument = Argument<ArgumentTypeName.StringArray, string[]>;
declare function isStringArrayArgument(
  arg: Argument<any, unknown>,
): arg is StringArrayArgument;
type PCDArgument<
  T extends PCD = PCD,
  ValidatorParams extends {
    notFoundMessage?: string;
  } = {
    notFoundMessage?: string;
  },
> = Argument<ArgumentTypeName.PCD, SerializedPCD<T>, ValidatorParams> & {
  pcdType?: string;
};
declare function isPCDArgument(arg: Argument<any, unknown>): arg is PCDArgument;
type ToggleList = Record<string, boolean>;
type ToogleListArgument<T extends ToggleList> = Argument<
  ArgumentTypeName.ToggleList,
  T
>;
declare function isToggleListArgument(
  arg: Argument<any, unknown>,
): arg is ToogleListArgument<ToggleList>;
type RevealList = Record<`reveal${string}`, boolean>;
type RevealListArgument<T extends RevealList> = Argument<
  ArgumentTypeName.ToggleList,
  T
>;
declare function isRevealListArgument(
  arg: ToogleListArgument<ToggleList>,
): arg is RevealListArgument<RevealList>;
interface ProveDisplayOptions<Args extends Record<PropertyKey, Argument<any>>> {
  defaultArgs?: ArgsDisplayOptions<Args>;
}
type ArgsDisplayOptions<Args extends Record<PropertyKey, Argument<any>>> = {
  [Property in keyof Args]: DisplayArg<Args[Property]>;
};
type RawValueType<T extends Argument<any, unknown>> = T extends PCDArgument<
  infer U,
  any
>
  ? U
  : T extends Argument<any, infer U>
  ? U
  : T;
type ArgumentValidator<T extends Argument<any, unknown>> = (
  value: RawValueType<T>,
  params: T["validatorParams"],
) => boolean;
/**
 * Enriched Argument for display purposes
 */
type DisplayArg<Arg extends Argument<any, unknown>> = Arg & {
  validate?: ArgumentValidator<Arg>;
};
