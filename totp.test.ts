import totp from "./index";

const mockNewDate = (mockDate: any, callback: () => void): void => {
    const spy = jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate);

    callback();
    spy.mockRestore();
};

describe("generateCode", () => {
    test("returns correct TOTP code with modifier", () => {
        const purpose = "EmailConfirmation";
        const userId = "cknxpnrvf000001jp176m87ik";
        const modifier = `TOTP:${purpose}:${userId}`;

        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        let code: number = 0;
        mockNewDate(
            new Date(1653358800000),
            () => code = totp.generateCode(token, modifier)
        );

        expect(code).toBe(258806);
    });

    test("returns correct TOTP code without modifier", () => {
        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        let code: number = 0;
        mockNewDate(
            new Date(1653358800000),
            () => code = totp.generateCode(token)
        );

        expect(code).toBe(990874);
    });
});

describe("validateCode", () => {
    const testData = [
        { timeStepMinutes: 3, minutes: -9, expected: false },
        { timeStepMinutes: 3, minutes: -8, expected: true },
        { timeStepMinutes: 3, minutes: -7, expected: true },
        { timeStepMinutes: 3, minutes: -6, expected: true },
        { timeStepMinutes: 3, minutes: -5, expected: true },
        { timeStepMinutes: 3, minutes: -4, expected: true },
        { timeStepMinutes: 3, minutes: -3, expected: true },
        { timeStepMinutes: 3, minutes: -2, expected: true },
        { timeStepMinutes: 3, minutes: -1, expected: true },
        { timeStepMinutes: 3, minutes:  0, expected: true },
        { timeStepMinutes: 3, minutes:  1, expected: true },
        { timeStepMinutes: 3, minutes:  2, expected: true },
        { timeStepMinutes: 3, minutes:  3, expected: true },
        { timeStepMinutes: 3, minutes:  4, expected: true },
        { timeStepMinutes: 3, minutes:  5, expected: true },
        { timeStepMinutes: 3, minutes:  6, expected: true },
        { timeStepMinutes: 3, minutes:  7, expected: false },
        { timeStepMinutes: 3, minutes:  8, expected: false },
        { timeStepMinutes: 3, minutes:  9, expected: false },
        // timeStepMinutes 2
        { timeStepMinutes: 2, minutes: -9, expected: false },
        { timeStepMinutes: 2, minutes: -8, expected: false },
        { timeStepMinutes: 2, minutes: -7, expected: false },
        { timeStepMinutes: 2, minutes: -6, expected: false },
        { timeStepMinutes: 2, minutes: -5, expected: false },
        { timeStepMinutes: 2, minutes: -4, expected: true },
        { timeStepMinutes: 2, minutes: -3, expected: true },
        { timeStepMinutes: 2, minutes: -2, expected: true },
        { timeStepMinutes: 2, minutes: -1, expected: true },
        { timeStepMinutes: 2, minutes: 0, expected: true },
        { timeStepMinutes: 2, minutes: 1, expected: true },
        { timeStepMinutes: 2, minutes: 2, expected: true },
        { timeStepMinutes: 2, minutes: 3, expected: true },
        { timeStepMinutes: 2, minutes: 4, expected: true },
        { timeStepMinutes: 2, minutes: 5, expected: true },
        { timeStepMinutes: 2, minutes: 6, expected: false },
        { timeStepMinutes: 2, minutes: 7, expected: false },
        { timeStepMinutes: 2, minutes: 8, expected: false },
        { timeStepMinutes: 2, minutes: 9, expected: false },
    ];

    testData.forEach(data => {
        const { timeStepMinutes, minutes, expected } = data;
        const purpose = "EmailConfirmation";
        const userId = "cknxpnrvf000001jp176m87ik";
        const modifier = `TOTP:${purpose}:${userId}`;

        const securityStamp = "soub@WOOL8pow-mol";
        const token = Buffer.from(securityStamp, "utf-8");

        test(`returns ${expected} for valid TOTP code with modifier, minutes delay: ${minutes}`, () => {
            const mockDateEpoc = 1653358800000;
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, modifier, timeStepMinutes)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, modifier, timeStepMinutes)
            );

            expect(isValid).toBe(expected);
        });

        test(`returns ${expected} for valid TOTP code without modifier, minutes delay: ${minutes}`, () => {
            const securityStamp = "soub@WOOL8pow-mol";
            const token = Buffer.from(securityStamp, "utf-8");

            const mockDateEpoc = 1653358800000;
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, undefined, timeStepMinutes)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, undefined, timeStepMinutes)
            );

            expect(isValid).toBe(expected);
        });
    });
});
