import totp from "./index";

const mockTimeNow = (mockDate,callback) => {
    const spy = jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate);
    
    const result = callback();
    spy.mockRestore();
    return result;
};

describe("generateCode", () => {
    test("returns correct TOTP code with modifier", () => {
        const purpose = "EmailConfirmation";
        const userId = "cknxpnrvf000001jp176m87ik";
        const modifier = `TOTP:${purpose}:${userId}`;

        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        let code;
        mockTimeNow(
            new Date(1653358800000),
            () => code = totp.generateCode(token, modifier)
        );

        expect(code).toBe(258806);
    });

    test("returns correct TOTP code without modifier", () => {
        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        let code;
        mockTimeNow(
            new Date(1653358800000),
            () => code = totp.generateCode(token)
        );

        expect(code).toBe(990874);
    });
});

describe("validateCode", () => {
    const testData = [
        { minutes: -9, expected: false },
        { minutes: -8, expected: true },
        { minutes: -7, expected: true },
        { minutes: -6, expected: true },
        { minutes: -5, expected: true },
        { minutes: -4, expected: true },
        { minutes: -3, expected: true },
        { minutes: -2, expected: true },
        { minutes: -1, expected: true },
        { minutes:  0, expected: true },
        { minutes:  1, expected: true },
        { minutes:  2, expected: true },
        { minutes:  3, expected: true },
        { minutes:  4, expected: true },
        { minutes:  5, expected: true },
        { minutes:  6, expected: true },
        { minutes:  7, expected: false },
        { minutes:  8, expected: false },
        { minutes:  9, expected: false },
    ];

    testData.forEach(data => {
        const { minutes, expected } = data;
        const purpose = "EmailConfirmation";
        const userId = "cknxpnrvf000001jp176m87ik";
        const modifier = `TOTP:${purpose}:${userId}`;

        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        test(`returns ${expected} for valid TOTP code with modifier, minutes delay: ${minutes}`, () => {
            const mockDateEpoc = 1653358800000;
            let code;
            mockTimeNow(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, modifier)
            );

            let isValid = false;
            mockTimeNow(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, modifier)
            );

            expect(isValid).toBe(expected);
        });

        test(`returns ${expected} for valid TOTP code without modifier, minutes delay: ${minutes}`, () => {
            const securityStamp = "soub@WOOL8pow-mol";
            const token = Buffer.from(securityStamp, "utf-8");

            const mockDateEpoc = 1653358800000;
            let code;
            mockTimeNow(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token)
            );

            let isValid = false;
            mockTimeNow(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token)
            );

            expect(isValid).toBe(expected);
        });
    });
});
