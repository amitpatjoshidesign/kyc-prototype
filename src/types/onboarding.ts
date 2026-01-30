/**
 * Comprehensive UPI Product Onboarding Data Structure
 * Covers all establishment types with CKYC auto-fill capability
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum EstablishmentType {
  INDIVIDUAL = "INDIVIDUAL",
  SOLE_PROPRIETOR = "SOLE_PROPRIETOR",
  PARTNERSHIP = "PARTNERSHIP",
  LLP = "LLP",
  PRIVATE_LIMITED_COMPANY = "PRIVATE_LIMITED_COMPANY",
  PUBLIC_LIMITED_COMPANY = "PUBLIC_LIMITED_COMPANY",
  GOVERNMENT_ENTITY = "GOVERNMENT_ENTITY",
  TRUST = "TRUST",
  SOCIETY = "SOCIETY",
  ASSOCIATION = "ASSOCIATION",
  CO_OPERATIVE = "CO_OPERATIVE",
  NGO = "NGO",
  HUF = "HUF",
  EDUCATION_INSTITUTION = "EDUCATION_INSTITUTION",
  HEALTHCARE_INSTITUTION = "HEALTHCARE_INSTITUTION",
  NIDHI = "NIDHI",
}

export enum IdentificationDocumentType {
  PAN = "PAN",
  AADHAAR = "AADHAAR",
  VOTER_ID = "VOTER_ID",
  PASSPORT = "PASSPORT",
  DRIVING_LICENSE = "DRIVING_LICENSE",
  CERTIFICATE_OF_INCORPORATION = "CERTIFICATE_OF_INCORPORATION",
  MEMORANDUM_OF_ASSOCIATION = "MEMORANDUM_OF_ASSOCIATION",
  PARTNERSHIP_DEED = "PARTNERSHIP_DEED",
  TRUST_DEED = "TRUST_DEED",
  REGISTRATION_CERTIFICATE = "REGISTRATION_CERTIFICATE",
  GST_CERTIFICATE = "GST_CERTIFICATE",
  BUSINESS_LICENSE = "BUSINESS_LICENSE",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
  UDYAM_REGISTRATION = "UDYAM_REGISTRATION",
  CIN = "CIN",
  DIN = "DIN",
}

export enum AddressProofType {
  AADHAAR = "AADHAAR",
  UTILITY_BILL = "UTILITY_BILL",
  PROPERTY_TAX_DOCUMENT = "PROPERTY_TAX_DOCUMENT",
  BANK_STATEMENT = "BANK_STATEMENT",
  RENTAL_AGREEMENT = "RENTAL_AGREEMENT",
  POSTAGE_ADDRESS = "POSTAGE_ADDRESS",
  PASSPORT = "PASSPORT",
  REGISTRATION_CERTIFICATE = "REGISTRATION_CERTIFICATE",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
}

export enum DocumentVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  RESUBMISSION_REQUIRED = "RESUBMISSION_REQUIRED",
}

export enum KYCStatus {
  NOT_INITIATED = "NOT_INITIATED",
  IN_PROGRESS = "IN_PROGRESS",
  CKYC_PENDING = "CKYC_PENDING",
  CKYC_COMPLETED = "CKYC_COMPLETED",
  MANUAL_VERIFICATION_PENDING = "MANUAL_VERIFICATION_PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
}

export enum ComplianceRequirement {
  AML_CHECK = "AML_CHECK",
  PEP_CHECK = "PEP_CHECK",
  SANCTION_LIST_CHECK = "SANCTION_LIST_CHECK",
  CKYC_VERIFICATION = "CKYC_VERIFICATION",
  GST_VERIFICATION = "GST_VERIFICATION",
  TAN_VERIFICATION = "TAN_VERIFICATION",
  CIN_VERIFICATION = "CIN_VERIFICATION",
  MOA_VERIFICATION = "MOA_VERIFICATION",
  BOARD_RESOLUTION_VERIFICATION = "BOARD_RESOLUTION_VERIFICATION",
  SIGNATORY_VERIFICATION = "SIGNATORY_VERIFICATION",
  BENEFICIAL_OWNER_VERIFICATION = "BENEFICIAL_OWNER_VERIFICATION",
}

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

/**
 * Core Individual Details (Person)
 */
export interface PersonDetails {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 format: YYYY-MM-DD
  gender: "MALE" | "FEMALE" | "OTHER";
  nationality: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  motherMaidenName?: string;
  pan: string;
  panVerificationStatus?: DocumentVerificationStatus;
  aadhaarNumber?: string;
  aadhaarVerificationStatus?: DocumentVerificationStatus;
  voterIdNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  ckycrId?: string; // CKYC Registry ID
  ckycrDetails?: CKYCRDetails;
  ckycrAutoFillEligible?: boolean;
  ckycrAutoFillTimestamp?: string;
  ckycrLastSyncedTimestamp?: string;
  politicallyExposedPerson?: boolean;
  pepVerificationStatus?: DocumentVerificationStatus;
  sanctionListCheckStatus?: DocumentVerificationStatus;
  investmentProfile?: {
    annualIncome: number;
    sourceOfFunds: string;
    investmentObjectives: string[];
  };
}

/**
 * CKYC Registry Details - Auto-filled data from CKYC
 */
export interface CKYCRDetails {
  ckycrId: string;
  registrationDate: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fatherName?: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  occupation: string;
  pan: string;
  aadhaarNumber?: string;
  aadhaarVerified: boolean;
  mobileNumber: string;
  emailAddress: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  kycStatus: string;
  kycCompletionDate: string;
  lastUpdated: string;
  isActive: boolean;
  ckycVerificationMethod: "AADHAAR_OTP" | "IRIS_SCAN" | "FINGERPRINT" | "FACE_RECOGNITION";
  sourceBank?: string;
  sourceNBFC?: string;
}

/**
 * Business Organization Details
 */
export interface OrganizationDetails {
  organizationName: string;
  alternateBusinessName?: string;
  businessType: EstablishmentType;
  businessCategory: "MANUFACTURING" | "SERVICE" | "TRADING" | "OTHERS";
  businessSubCategory?: string;
  registrationNumber: string; // CIN, DIN, GST, etc.
  registrationDate: string;
  registrationAuthority: string;
  jurisdictionState: string;
  industryCode: string; // NACE code or equivalent
  businessDescription: string;
  businessObjectives?: string[];
  annualTurnover?: number;
  numberOfEmployees?: number;
  businessLicenseNumber?: string;
  businessLicenseExpiryDate?: string;
  udyamRegistrationNumber?: string;
  gstnNumber?: string;
  gstRegistrationDate?: string;
  gstnVerificationStatus?: DocumentVerificationStatus;
  tanNumber?: string;
  tanVerificationStatus?: DocumentVerificationStatus;
  businessWebsite?: string;
  businessEmail: string;
  businessPhone: string;
  mainBusinessActivity: string;
  secondaryBusinessActivities?: string[];
}

/**
 * Partnership-Specific Details
 */
export interface PartnershipDetails {
  partnershipDeedRegistrationNumber: string;
  partnershipDeedRegistrationDate: string;
  numberOfPartners: number;
  partners: PartnerInfo[];
  partnershipDeedVerificationStatus?: DocumentVerificationStatus;
  profitSharingRatio?: Record<string, number>;
}

export interface PartnerInfo {
  name: string;
  pan: string;
  aadhaar?: string;
  designationInPartnership: string;
  sharePercentage: number;
  isActivePartner: boolean;
  partnershipEntryDate: string;
}

/**
 * Company-Specific Details (Pvt/Pub Ltd)
 */
export interface CompanyDetails {
  cin: string;
  cinVerificationStatus?: DocumentVerificationStatus;
  companyRegistrationDate: string;
  companyType: "PRIVATE_LIMITED" | "PUBLIC_LIMITED" | "FOREIGN_COMPANY";
  memorandumOfAssociation: DocumentReference;
  articlesOfAssociation?: DocumentReference;
  boardOfDirectorsCount: number;
  directors: DirectorInfo[];
  authorizedShareCapital?: number;
  paidUpShareCapital?: number;
  companyStatus: "ACTIVE" | "DORMANT" | "DISSOLVED" | "STRUCK_OFF";
  registrarOfCompanies: string;
  companyNature: string[];
  mainBusinessActivity: string;
  boardResolution?: DocumentReference;
  boardResolutionVerificationStatus?: DocumentVerificationStatus;
  beneficialOwnershipStructure?: BeneficialOwnershipNode[];
}

export interface DirectorInfo {
  name: string;
  din: string;
  dinVerificationStatus?: DocumentVerificationStatus;
  pan: string;
  dateOfBirth: string;
  appointmentDate: string;
  resignationDate?: string;
  directorStatus: "ACTIVE" | "RESIGNED" | "DISQUALIFIED";
  isDesignatedPartner?: boolean;
  residentialStatus: "RESIDENT" | "NON_RESIDENT";
  address: Address;
  email: string;
  phone: string;
}

export interface BeneficialOwnershipNode {
  name: string;
  pan: string;
  relationshipType: string;
  ownershipPercentage: number;
  level: number;
  children?: BeneficialOwnershipNode[];
}

/**
 * Trust-Specific Details
 */
export interface TrustDetails {
  trustName: string;
  trustRegistrationNumber: string;
  trustDeedDate: string;
  trustDeedVerificationStatus?: DocumentVerificationStatus;
  trusteeDetails: TrusteeInfo[];
  settlorDetails?: SettlorInfo;
  beneficiariesCount: number;
  beneficiaryProof?: DocumentReference;
  trustPurpose: string;
  trustAssets?: number;
}

export interface TrusteeInfo {
  name: string;
  pan: string;
  aadhaar?: string;
  dateOfBirth: string;
  appointmentDate: string;
  trusteeType: "PRIMARY" | "SECONDARY" | "CO_TRUSTEE";
  isTrusteeIndividual: boolean;
  address: Address;
  phone: string;
  email: string;
}

export interface SettlorInfo {
  name: string;
  pan: string;
  dateOfBirth: string;
  settlementDate: string;
  address: Address;
  phone: string;
  email: string;
}

/**
 * Society-Specific Details
 */
export interface SocietyDetails {
  registrationNumber: string;
  registrationDate: string;
  registrationAuthority: string;
  byLaws?: DocumentReference;
  membershipCount: number;
  managingCommitteeDetails: CommitteeInfo[];
  societyPurpose: string;
  societyAddress: Address;
}

export interface CommitteeInfo {
  name: string;
  pan: string;
  position: string;
  appointmentDate: string;
  termEndDate?: string;
  address: Address;
  phone: string;
  email: string;
}

/**
 * Co-operative-Specific Details
 */
export interface CoOperativeDetails {
  registrationNumber: string;
  registrationDate: string;
  registrationAuthority: string;
  cooperativeType: "CREDIT" | "CONSUMER" | "PRODUCER" | "SERVICE" | "MULTI_PURPOSE";
  membershipCount: number;
  boardOfManagementDetails: BoardInfo[];
  cooperativeByLaws?: DocumentReference;
  shareCapital?: number;
}

export interface BoardInfo {
  name: string;
  pan: string;
  position: string;
  appointmentDate: string;
  termEndDate?: string;
  address: Address;
  phone: string;
  email: string;
  isRepresentative: boolean;
}

/**
 * LLP-Specific Details
 */
export interface LLPDetails {
  llpIdentificationNumber: string;
  llpRegistrationDate: string;
  memorandumOfPartnership: DocumentReference;
  designatedPartners: DesignatedPartnerInfo[];
  partnershipCount: number;
  llpAgreement?: DocumentReference;
  capitalContribution?: Record<string, number>;
}

export interface DesignatedPartnerInfo {
  name: string;
  din: string;
  dinVerificationStatus?: DocumentVerificationStatus;
  pan: string;
  dateOfBirth: string;
  appointmentDate: string;
  address: Address;
  phone: string;
  email: string;
  capitalContribution?: number;
}

/**
 * HUF (Hindu Undivided Family) Details
 */
export interface HUFDetails {
  huffName: string;
  panOfHuf: string;
  huffFormerName?: string;
  karta: KartaInfo;
  dateOfFormation: string;
  ancestralProperty?: boolean;
  propertyDocuments?: DocumentReference[];
}

export interface KartaInfo {
  name: string;
  pan: string;
  dateOfBirth: string;
  address: Address;
  phone: string;
  email: string;
}

/**
 * NGO/Non-Profit Organization Details
 */
export interface NGODetails {
  registrationNumber: string;
  registrationDate: string;
  registrationType: "80G" | "12A" | "SECTION_8" | "DARPAN" | "NITI_AAYOG";
  certificateOf80G?: {
    certificateNumber: string;
    dateOfIssue: string;
    dateOfExpiry: string;
  };
  certificateOf12A?: {
    certificateNumber: string;
    dateOfIssue: string;
  };
  ngoMission: string;
  ngoVision?: string;
  focusAreas: string[];
  trusteeCount: number;
  trusteesDetails: NGOTrusteeInfo[];
  annualRevenueNGO?: number;
  numberOfBeneficiaries?: number;
  registrationCertificate?: DocumentReference;
  auditReport?: DocumentReference;
}

export interface NGOTrusteeInfo {
  name: string;
  pan: string;
  position: string;
  dateOfBirth: string;
  appointmentDate: string;
  address: Address;
  phone: string;
  email: string;
}

/**
 * Educational Institution Details
 */
export interface EducationInstitutionDetails {
  institutionName: string;
  affiliationNumber?: string;
  universityAffiliation?: string;
  affiliationDate?: string;
  educationLevel: "PRIMARY" | "SECONDARY" | "HIGHER_SECONDARY" | "GRADUATE" | "POST_GRADUATE";
  recognitionFromState: boolean;
  recognitionFromCentral: boolean;
  recognitionDocuments?: DocumentReference[];
  principalDetails: InstitutionHeadInfo;
  managingTrusteeDetails?: InstitutionHeadInfo;
  studentStrength: number;
  staffStrength: number;
}

export interface InstitutionHeadInfo {
  name: string;
  pan: string;
  designation: string;
  dateOfBirth: string;
  qualifications: string[];
  appointmentDate: string;
  address: Address;
  phone: string;
  email: string;
}

/**
 * Healthcare Institution Details
 */
export interface HealthcareInstitutionDetails {
  institutionName: string;
  registrationNumber: string;
  registrationAuthority: string;
  registrationDate: string;
  institutionType: "HOSPITAL" | "CLINIC" | "DIAGNOSTIC_CENTER" | "NURSING_HOME" | "AYURVEDA" | "HOMEOPATHY";
  accreditationDetails?: {
    accreditationBody: string;
    accreditationNumber: string;
    dateOfAccreditation: string;
    expiryDate: string;
  };
  medicalPractitionerLicense?: string;
  numberOfBeds?: number;
  departmentsOffered?: string[];
  administratorDetails: InstitutionHeadInfo;
  medicalDirectorDetails?: InstitutionHeadInfo;
}

/**
 * Address Structure
 */
export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  addressProofType?: AddressProofType;
  addressProofDocument?: DocumentReference;
  addressProofVerificationStatus?: DocumentVerificationStatus;
  isResidential?: boolean;
  isRegisteredAddress?: boolean;
  addressDuration?: {
    fromDate: string;
    toDate?: string;
  };
}

/**
 * Banking Information
 */
export interface BankingDetails {
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT" | "BUSINESS" | "TRUST";
  ifscCode: string;
  bankName: string;
  branchName: string;
  branchCode?: string;
  micr?: string;
  accountOpeningDate?: string;
  accountStatus: "ACTIVE" | "INACTIVE" | "FROZEN" | "CLOSED";
  isAccountVerified: boolean;
  accountVerificationMethod?: "MICRO_DEPOSIT" | "BANK_STATEMENT" | "VOIDED_CHEQUE" | "BANKING_CHANNEL";
  bankStatementDocument?: DocumentReference;
  voidedCheque?: DocumentReference;
  monthlyAverageBalance?: number;
  accountLimitValidationDate?: string;
  alternateAccounts?: BankingDetails[];
}

/**
 * Document Reference with Storage Details
 */
export interface DocumentReference {
  documentId: string;
  documentName: string;
  documentType: IdentificationDocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileFormat: "PDF" | "JPG" | "PNG" | "GIF";
  uploadDate: string;
  expiryDate?: string;
  verificationStatus: DocumentVerificationStatus;
  verificationComments?: string;
  verifiedBy?: string;
  verificationDate?: string;
  storageLocation: "S3" | "VAULT" | "BLOB_STORAGE";
  encryptionDetails?: {
    algorithm: string;
    keyId: string;
  };
  checksumValue?: string;
  isArchived: boolean;
}

/**
 * Signatory & Authorization Details
 */
export interface SignatoryDetails {
  signatoryName: string;
  pan: string;
  dateOfBirth: string;
  signatoryType: "AUTHORIZED_SIGNATORY" | "JOINT_SIGNATORY" | "SOLE_SIGNATORY" | "DIRECTOR" | "TRUSTEE" | "PARTNER";
  designation: string;
  appointmentDate: string;
  resignationDate?: string;
  signingPowers: string[];
  signatoryAddress: Address;
  signatoryPhone: string;
  signatoryEmail: string;
  signatureVerificationStatus?: DocumentVerificationStatus;
  signatureDocument?: DocumentReference;
  isActiveSignatory: boolean;
  signatoryLimitAmount?: number;
}

/**
 * Compliance & Risk Assessment
 */
export interface ComplianceAssessment {
  assessmentId: string;
  assessmentDate: string;
  riskProfile: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  complianceChecks: ComplianceCheck[];
  amlCheckResult: AMLCheckResult;
  pepCheckResult: PEPCheckResult;
  sanctionListCheckResult: SanctionListCheckResult;
  overallComplianceStatus: "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
  overallComplianceComments?: string;
  reviewedBy?: string;
  reviewDate?: string;
  nextReviewDate?: string;
}

export interface ComplianceCheck {
  checkType: ComplianceRequirement;
  checkStatus: "NOT_INITIATED" | "IN_PROGRESS" | "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
  checkResult?: string;
  checkDate?: string;
  expiryDate?: string;
  remarks?: string;
}

export interface AMLCheckResult {
  checkId: string;
  amlCheckDate: string;
  amlCheckStatus: "PASSED" | "FAILED" | "MANUAL_REVIEW_REQUIRED";
  amlRiskScore?: number;
  amlCheckRemarks?: string;
}

export interface PEPCheckResult {
  checkId: string;
  pepCheckDate: string;
  pepCheckStatus: "NOT_PEP" | "PEP_FOUND" | "MANUAL_REVIEW_REQUIRED";
  pepDetails?: {
    pepType: string;
    pepLevel: string;
    country: string;
    relationship: string;
  };
  pepCheckRemarks?: string;
}

export interface SanctionListCheckResult {
  checkId: string;
  sanctionCheckDate: string;
  sanctionCheckStatus: "NOT_SANCTIONED" | "SANCTIONED" | "MANUAL_REVIEW_REQUIRED";
  sanctionListName?: string;
  sanctionCheckRemarks?: string;
}

/**
 * MAIN ONBOARDING REQUEST STRUCTURE
 */
export interface UPIOnboardingRequest {
  // Metadata
  requestId: string;
  requestTimestamp: string;
  requestSource: "MOBILE_APP" | "WEB_APP" | "API" | "BRANCH" | "CSR_PORTAL";
  campaignId?: string;
  referralCode?: string;
  deviceInfo?: {
    deviceId: string;
    deviceType: "MOBILE" | "TABLET" | "WEB";
    operatingSystem: string;
    appVersion: string;
    ipAddress: string;
    location?: {
      latitude: number;
      longitude: number;
      city: string;
      state: string;
    };
  };

  // Establishment Type Classification
  establishmentType: EstablishmentType;
  primaryBusinessPurpose: string;

  // Personal/Organization Details (discriminated by establishment type)
  personDetails?: PersonDetails;
  organizationDetails?: OrganizationDetails;

  // Establishment-Type Specific Details
  partnershipDetails?: PartnershipDetails;
  companyDetails?: CompanyDetails;
  trustDetails?: TrustDetails;
  societyDetails?: SocietyDetails;
  cooperativeDetails?: CoOperativeDetails;
  llpDetails?: LLPDetails;
  huffDetails?: HUFDetails;
  ngoDetails?: NGODetails;
  educationInstitutionDetails?: EducationInstitutionDetails;
  healthcareInstitutionDetails?: HealthcareInstitutionDetails;

  // Address Information
  registeredAddress: Address;
  communicationAddress?: Address;
  businessAddress?: Address;
  correspondenceAddress?: Address;
  additionalAddresses?: Address[];

  // Banking Information
  bankingDetails: BankingDetails;
  bankVerificationStatus?: DocumentVerificationStatus;

  // Signatory & Authorization
  signatories: SignatoryDetails[];
  authorizedSignatory: SignatoryDetails;

  // KYC & Verification Details
  kycStatus: KYCStatus;
  kycInitiationDate?: string;
  kycApprovalDate?: string;
  ckycrOptIn: boolean; // User opt-in for CKYC auto-fill
  ckycrAutoFillAttempted?: boolean;
  ckycrAutoFillSuccessful?: boolean;
  ckycrAutoFillTimestamp?: string;
  ckycrAutoFillErrorReason?: string;
  kycDocuments: DocumentReference[];
  kycRejectionReasons?: string[];
  kycRejectionDate?: string;
  kycApprovedBy?: string;
  kycApprovedDate?: string;

  // Compliance & Risk Assessment
  complianceAssessment: ComplianceAssessment;
  riskAssessmentScore?: number;
  flaggedForManualReview?: boolean;
  manualReviewComments?: string;

  // UPI-Specific Configuration
  upiConfig: {
    vpaRequestId?: string;
    desiredVPA?: string;
    vpaAllocated?: string;
    vpaActivationDate?: string;
    transactionLimit?: {
      dailyLimit: number;
      monthlyLimit: number;
      perTransactionLimit: number;
    };
    upiServicesEnabled: {
      p2p: boolean;
      p2b: boolean;
      b2p: boolean;
      billPayment: boolean;
      recurringPayments: boolean;
      standingInstructions: boolean;
      collectRequests: boolean;
      requestMoney: boolean;
      linkAadharPayment: boolean;
    };
    notificationPreferences: {
      smsNotifications: boolean;
      emailNotifications: boolean;
      pushNotifications: boolean;
      notificationLanguage: string;
    };
  };

  // Consent & Agreement
  consents: ConsentRecord[];
  termsAndConditionsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  fatcaDeclaration?: FATCADeclaration;
  pipDeclaration?: PIPDeclaration;

  // Additional Information
  reasonForOnboarding?: string;
  sourceOfFundsDeclaration?: string;
  politicsRelated?: boolean;
  additionalNotes?: string;

  // Metadata & Status Tracking
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  status: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  statusHistory: StatusHistoryEntry[];
  externalReferenceIds?: Record<string, string>; // For linking to external systems
}

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  changedBy?: string;
  changeReason?: string;
  additionalData?: Record<string, unknown>;
}

/**
 * CKYC Auto-Fill Configuration
 */
export interface CKYCAutoFillConfig {
  ckycrId: string;
  ckycrPin: string; // For verification
  fetchMethod: "API" | "OTP" | "AADHAAR_OTP";
  autoFillFields: {
    personal: boolean;
    address: boolean;
    contact: boolean;
    identificationDocuments: boolean;
  };
  partialMatchAllowed: boolean;
  overwriteExistingData: boolean;
  validationRules?: {
    panMustMatch: boolean;
    dateOfBirthTolerance: number; // days
    addressFlexibility: "EXACT" | "PARTIAL" | "FLEXIBLE";
  };
}

export interface CKYCAutoFillResponse {
  success: boolean;
  ckycrId: string;
  fetchTimestamp: string;
  autoFilledData: {
    personDetails?: Partial<PersonDetails>;
    address?: Partial<Address>;
    bankingDetails?: Partial<BankingDetails>;
  };
  fieldsMappingStatus: Record<string, boolean>;
  conflictingFields?: ConflictingField[];
  validationErrors?: ValidationError[];
  recommendedActions?: string[];
}

export interface ConflictingField {
  fieldName: string;
  ckycrValue: unknown;
  existingValue: unknown;
  recommendation: "OVERWRITE" | "KEEP_EXISTING" | "MANUAL_REVIEW";
}

/**
 * Consent Record
 */
export interface ConsentRecord {
  consentId: string;
  consentType:
    | "TERMS_AND_CONDITIONS"
    | "PRIVACY_POLICY"
    | "MARKETING"
    | "CKYC_AUTO_FILL"
    | "DATA_SHARING"
    | "REGULATORY_DISCLOSURE"
    | "FATCA"
    | "PIP";
  consentDescription: string;
  consentGiven: boolean;
  consentDate: string;
  consentVersion: string;
  consentSource: "ONLINE" | "OFFLINE" | "VOICE" | "EMAIL";
  expiryDate?: string;
  withdrawalDate?: string;
}

/**
 * FATCA (Foreign Account Tax Compliance Act) Declaration
 */
export interface FATCADeclaration {
  isUSCitizen: boolean;
  isUSResident: boolean;
  usTaxIdNumber?: string;
  usAddress?: Address;
  declarationDate: string;
  declarationStatus: "PENDING" | "SUBMITTED" | "VERIFIED";
}

/**
 * PIP (Permanent Instruction Page) Declaration
 */
export interface PIPDeclaration {
  pipNumber?: string;
  isPIPApplicable: boolean;
  pipCategory?: string;
  pipDeclarationDate: string;
  pipStatus: "PENDING" | "SUBMITTED" | "VERIFIED";
}

/**
 * Validation Error
 */
export interface ValidationError {
  fieldName: string;
  errorCode: string;
  errorMessage: string;
  severity: "INFO" | "WARNING" | "ERROR";
  suggestedCorrection?: string;
}

// ============================================================================
// ESTABLISHMENT TYPE MAPPER
// ============================================================================

export type EstablishmentTypeDetails =
  | PersonDetails
  | PartnershipDetails
  | CompanyDetails
  | TrustDetails
  | SocietyDetails
  | CoOperativeDetails
  | LLPDetails
  | HUFDetails
  | NGODetails
  | EducationInstitutionDetails
  | HealthcareInstitutionDetails;

export const ESTABLISHMENT_TYPE_REQUIREMENTS: Record<EstablishmentType, {
  requiredFields: string[];
  documentTypes: IdentificationDocumentType[];
  signatoryCount: { min: number; max: number };
  complianceChecks: ComplianceRequirement[];
  approvalLevels?: number;
}> = {
  [EstablishmentType.INDIVIDUAL]: {
    requiredFields: ["personDetails", "registeredAddress", "bankingDetails"],
    documentTypes: [IdentificationDocumentType.PAN, IdentificationDocumentType.AADHAAR],
    signatoryCount: { min: 1, max: 1 },
    complianceChecks: [
      ComplianceRequirement.AML_CHECK,
      ComplianceRequirement.PEP_CHECK,
      ComplianceRequirement.SANCTION_LIST_CHECK,
      ComplianceRequirement.CKYC_VERIFICATION,
    ],
  },
  [EstablishmentType.SOLE_PROPRIETOR]: {
    requiredFields: ["personDetails", "organizationDetails", "registeredAddress", "bankingDetails"],
    documentTypes: [
      IdentificationDocumentType.PAN,
      IdentificationDocumentType.AADHAAR,
      IdentificationDocumentType.GST_CERTIFICATE,
      IdentificationDocumentType.UDYAM_REGISTRATION,
    ],
    signatoryCount: { min: 1, max: 2 },
    complianceChecks: [
      ComplianceRequirement.AML_CHECK,
      ComplianceRequirement.PEP_CHECK,
      ComplianceRequirement.SANCTION_LIST_CHECK,
      ComplianceRequirement.GST_VERIFICATION,
    ],
  },
  [EstablishmentType.PARTNERSHIP]: {
    requiredFields: [
      "organizationDetails",
      "partnershipDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.PARTNERSHIP_DEED, IdentificationDocumentType.GST_CERTIFICATE],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [
      ComplianceRequirement.AML_CHECK,
      ComplianceRequirement.PEP_CHECK,
      ComplianceRequirement.SIGNATORY_VERIFICATION,
      ComplianceRequirement.GST_VERIFICATION,
    ],
  },
  [EstablishmentType.LLP]: {
    requiredFields: [
      "organizationDetails",
      "llpDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [
      IdentificationDocumentType.CIN,
      IdentificationDocumentType.DIN,
      IdentificationDocumentType.GST_CERTIFICATE,
    ],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [
      ComplianceRequirement.CIN_VERIFICATION,
      ComplianceRequirement.MOA_VERIFICATION,
      ComplianceRequirement.SIGNATORY_VERIFICATION,
      ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION,
    ],
    approvalLevels: 2,
  },
  [EstablishmentType.PRIVATE_LIMITED_COMPANY]: {
    requiredFields: [
      "organizationDetails",
      "companyDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [
      IdentificationDocumentType.CIN,
      IdentificationDocumentType.DIN,
      IdentificationDocumentType.CERTIFICATE_OF_INCORPORATION,
      IdentificationDocumentType.GST_CERTIFICATE,
    ],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [
      ComplianceRequirement.CIN_VERIFICATION,
      ComplianceRequirement.MOA_VERIFICATION,
      ComplianceRequirement.BOARD_RESOLUTION_VERIFICATION,
      ComplianceRequirement.SIGNATORY_VERIFICATION,
      ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION,
    ],
    approvalLevels: 3,
  },
  [EstablishmentType.PUBLIC_LIMITED_COMPANY]: {
    requiredFields: [
      "organizationDetails",
      "companyDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [
      IdentificationDocumentType.CIN,
      IdentificationDocumentType.DIN,
      IdentificationDocumentType.CERTIFICATE_OF_INCORPORATION,
      IdentificationDocumentType.GST_CERTIFICATE,
    ],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [
      ComplianceRequirement.CIN_VERIFICATION,
      ComplianceRequirement.MOA_VERIFICATION,
      ComplianceRequirement.BOARD_RESOLUTION_VERIFICATION,
      ComplianceRequirement.SIGNATORY_VERIFICATION,
      ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION,
    ],
    approvalLevels: 4,
  },
  [EstablishmentType.GOVERNMENT_ENTITY]: {
    requiredFields: ["organizationDetails", "registeredAddress", "bankingDetails"],
    documentTypes: [IdentificationDocumentType.BUSINESS_REGISTRATION],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [ComplianceRequirement.SANCTION_LIST_CHECK],
  },
  [EstablishmentType.TRUST]: {
    requiredFields: ["organizationDetails", "trustDetails", "registeredAddress", "bankingDetails", "signatories"],
    documentTypes: [IdentificationDocumentType.TRUST_DEED, IdentificationDocumentType.PAN],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [
      ComplianceRequirement.AML_CHECK,
      ComplianceRequirement.PEP_CHECK,
      ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION,
    ],
  },
  [EstablishmentType.SOCIETY]: {
    requiredFields: [
      "organizationDetails",
      "societyDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.REGISTRATION_CERTIFICATE],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK, ComplianceRequirement.SIGNATORY_VERIFICATION],
  },
  [EstablishmentType.ASSOCIATION]: {
    requiredFields: [
      "organizationDetails",
      "societyDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.MEMORANDUM_OF_ASSOCIATION],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK, ComplianceRequirement.SIGNATORY_VERIFICATION],
  },
  [EstablishmentType.CO_OPERATIVE]: {
    requiredFields: [
      "organizationDetails",
      "cooperativeDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.REGISTRATION_CERTIFICATE],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK, ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION],
  },
  [EstablishmentType.NGO]: {
    requiredFields: ["organizationDetails", "ngoDetails", "registeredAddress", "bankingDetails", "signatories"],
    documentTypes: [IdentificationDocumentType.REGISTRATION_CERTIFICATE, IdentificationDocumentType.PAN],
    signatoryCount: { min: 2, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK, ComplianceRequirement.PEP_CHECK],
  },
  [EstablishmentType.HUF]: {
    requiredFields: ["personDetails", "huffDetails", "registeredAddress", "bankingDetails"],
    documentTypes: [IdentificationDocumentType.PAN],
    signatoryCount: { min: 1, max: 2 },
    complianceChecks: [
      ComplianceRequirement.AML_CHECK,
      ComplianceRequirement.PEP_CHECK,
      ComplianceRequirement.CKYC_VERIFICATION,
    ],
  },
  [EstablishmentType.EDUCATION_INSTITUTION]: {
    requiredFields: [
      "organizationDetails",
      "educationInstitutionDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.REGISTRATION_CERTIFICATE, IdentificationDocumentType.PAN],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK, ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION],
  },
  [EstablishmentType.HEALTHCARE_INSTITUTION]: {
    requiredFields: [
      "organizationDetails",
      "healthcareInstitutionDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.BUSINESS_LICENSE, IdentificationDocumentType.PAN],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [ComplianceRequirement.AML_CHECK],
  },
  [EstablishmentType.NIDHI]: {
    requiredFields: [
      "organizationDetails",
      "companyDetails",
      "registeredAddress",
      "bankingDetails",
      "signatories",
    ],
    documentTypes: [IdentificationDocumentType.CIN, IdentificationDocumentType.DIN],
    signatoryCount: { min: 1, max: -1 },
    complianceChecks: [
      ComplianceRequirement.CIN_VERIFICATION,
      ComplianceRequirement.BOARD_RESOLUTION_VERIFICATION,
      ComplianceRequirement.BENEFICIAL_OWNER_VERIFICATION,
    ],
    approvalLevels: 2,
  },
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type UPIOnboardingResponse = {
  success: boolean;
  onboardingId: string;
  requestId: string;
  status: UPIOnboardingRequest["status"];
  message: string;
  nextSteps?: string[];
  errors?: ValidationError[];
  warnings?: ValidationError[];
  ckycrAutoFillDetails?: CKYCAutoFillResponse;
  approvalTimeline?: {
    estimatedCompletionDate: string;
    currentApprovalStage: number;
    totalApprovalStages: number;
  };
};

export type BulkOnboardingRequest = {
  bulkRequestId: string;
  requestTimestamp: string;
  onboardingRequests: UPIOnboardingRequest[];
  totalRequests: number;
};

export type BulkOnboardingResponse = {
  bulkRequestId: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  responses: UPIOnboardingResponse[];
  summary: {
    overallStatus: "ALL_SUCCESS" | "PARTIAL_SUCCESS" | "ALL_FAILED";
    processingTime: number;
    failureReasons: Record<string, number>;
  };
};
