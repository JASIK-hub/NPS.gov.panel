export interface NCALayerCertificateInfo {
  subject: string;
  issuer: string;
  serialNumber: string;
  notBefore: string;
  notAfter: string;
  certEncoded: string;
}

export interface NCALayerCertificate {
  issuer: string;
  serialNumber: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  certEncoded: string;
  certChainEncoded: string;
  publicKey: string;
  dnsNames?: string[];
}

export interface NCALayerParsedData {
  surname: string;
  givenName: string;
  iin?: string;
  email?: string;
  organization?: string;
  country?: string;
}
