import { NCALayerClient } from 'ncalayer-js-client';
import {
  NCALayerCertificateInfo,
  NCALayerCertificate,
  NCALayerParsedData
} from './ncalayer/types';
import {
  toBase64,
  parseCertificateData,
  formatFullName,
  extractEmailFromCert,
  isCertificateValid,
  hasValidIIN
} from './ncalayer/utils';

class NCALayerService {
  private client: NCALayerClient;
  private isConnected: boolean = false;
  public fileStorageType = 'PKCS12';

  constructor() {
    this.client = new NCALayerClient();
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.connect();
      this.isConnected = true;
      return true;
    } catch {
      this.isConnected = false;
      return false;
    }
  }

  async ensureConnected() {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
      } catch (error) {
        this.isConnected = false;
        throw error;
      }
    }
  }

  async signDataWithDialog(data: string) {
    try {
      await this.ensureConnected();

      const activeTokens = await this.client.getActiveTokens();
      const storageType = activeTokens && activeTokens.length > 0 ? activeTokens[0] : this.fileStorageType;

      const base64Data = toBase64(data);
      const signature = await this.client.createCAdESFromBase64(storageType, base64Data);

      return {
        signature,
        data:base64Data
      };
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    this.isConnected = false;
  }

  async getActiveCertificate(): Promise<NCALayerCertificateInfo> {
    try {
      await this.ensureConnected();

      const result = await (this.client as any).getActiveCertificate();

      return result;
    } catch (error) {
      throw error;
    }
  }

  parseCertificateData(cert: NCALayerCertificateInfo | NCALayerCertificate): NCALayerParsedData {
    return parseCertificateData(cert);
  }
}

export const ncalayerService = new NCALayerService();

export {
  formatFullName,
  extractEmailFromCert,
  isCertificateValid,
  hasValidIIN
};

export type {
  NCALayerCertificateInfo,
  NCALayerCertificate,
  NCALayerParsedData
};
