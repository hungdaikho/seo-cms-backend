import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_REDIRECT_URI || '',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        console.log('Google Profile:', {
            id,
            name,
            emails,
            photos,
            displayName: profile.displayName
        });

        const user = {
            googleId: id,
            email: emails[0]?.value,
            firstName: name?.givenName || profile.displayName?.split(' ')[0] || 'User',
            lastName: name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || '',
            picture: photos[0]?.value || '',
            accessToken,
            refreshToken,
        };

        console.log('Processed user data:', user);

        done(null, user);
    }
}
