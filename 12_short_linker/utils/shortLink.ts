import crypto from 'crypto';

const BaseUrl = `localhost:3000/`;

export class ShortLinkUtils {
    public shortLink() {
        const shortUrl = crypto.randomBytes(4).toString('hex');
        return `${BaseUrl}${shortUrl}`;
    }
}