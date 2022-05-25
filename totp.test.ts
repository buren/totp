import totp from "./index";

const mockNewDate = (mockDate: any, callback: () => void): void => {
    const spy = jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate);

    callback();
    spy.mockRestore();
};

const purpose = "EmailConfirmation";
const userId = "cknxpnrvf000001jp176m87ik";
const modifier = `TOTP:${purpose}:${userId}`;

const securityStamp = "soub@WOOL8pow-mol";
const token = Buffer.from(securityStamp, "utf-8");
const mockDateEpoc = 1653358800000;

describe("generateCode", () => {
    test("returns correct TOTP code with modifier", () => {
        let code: number = 0;
        mockNewDate(
            new Date(mockDateEpoc),
            () => code = totp.generateCode(token, modifier)
        );

        expect(code).toBe(258806);
    });

    test("returns correct TOTP code without modifier", () => {
        let code: number = 0;
        mockNewDate(
            new Date(mockDateEpoc),
            () => code = totp.generateCode(token)
        );

        expect(code).toBe(990874);
    });
});

describe("validateCode", () => {
    const testData = [
        { minutes: -9, expected: false },
        { minutes: -8, expected: true },
        { minutes: 6, expected: true },
        { minutes: 7, expected: false },
    ];

    testData.forEach(data => {
        const { minutes, expected } = data;

        test(`returns ${expected} for valid TOTP code with modifier, minutes delay: ${minutes}`, () => {
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, modifier)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, modifier)
            );

            expect(isValid).toBe(expected);
        });

        test(`returns ${expected} for valid TOTP code without modifier, minutes delay: ${minutes}`, () => {
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token)
            );

            expect(isValid).toBe(expected);
        });
    });
});
