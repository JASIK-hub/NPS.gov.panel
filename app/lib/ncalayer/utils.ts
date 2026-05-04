import { NCALayerCertificateInfo, NCALayerCertificate, NCALayerParsedData } from './types';

export function toBase64(str: string): string {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString('base64');
}

export function parseCertificateData(cert: NCALayerCertificateInfo | NCALayerCertificate): NCALayerParsedData {
  try {
    const subject = cert.subject;
    const parts: any = {};

    const subjectParts = subject.split(',');
    subjectParts.forEach((part: string) => {
      const [key, value] = part.split('=');
      if (key && value) {
        parts[key.trim()] = value.trim();
      }
    });

    const cn = parts.CN || '';
    const fioMatch = cn.match(/^([А-Яа-яЁё\s]+)\s*\(?(\d{12})?\)?/);

    const surname = fioMatch?.[1]?.split(' ')?.[0] || '';
    const givenName = fioMatch?.[1]?.split(' ')?.slice(1)?.join(' ') || '';
    const iin = fioMatch?.[2] || '';

    return {
      surname,
      givenName,
      iin,
      organization: parts.O || '',
      country: parts.C || 'KZ'
    };
  } catch (error) {
    return {
      surname: '',
      givenName: '',
      country: 'KZ'
    };
  }
}

export function formatFullName(parsedData: NCALayerParsedData): string {
  const parts = [parsedData.surname, parsedData.givenName].filter(Boolean);
  return parts.join(' ');
}

export function extractEmailFromCert(cert: NCALayerCertificateInfo | NCALayerCertificate): string | undefined {
  try {
    const subject = cert.subject.toLowerCase();
    const emailMatch = subject.match(/email=([^,]+)/i);
    if (emailMatch?.[1]) return emailMatch[1].trim();

    const emailAddressMatch = subject.match(/emailaddress=([^,]+)/i);
    if (emailAddressMatch?.[1]) return emailAddressMatch[1].trim();

    if ('dnsNames' in cert && cert.dnsNames && cert.dnsNames.length > 0) {
      const emailDns = cert.dnsNames.find((name: string) => name.includes('@'));
      if (emailDns) return emailDns;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function isCertificateValid(cert: NCALayerCertificateInfo | NCALayerCertificate): boolean {
  try {
    const now = new Date();
    const notBefore = new Date(cert.notBefore);
    const notAfter = new Date(cert.notAfter);
    return now >= notBefore && now <= notAfter;
  } catch {
    return false;
  }
}

export function hasValidIIN(parsedData: NCALayerParsedData): boolean {
  return !!parsedData.iin && /^\d{12}$/.test(parsedData.iin);
}
