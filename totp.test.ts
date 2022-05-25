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
        // timeStep 3 min
        { timeStep: 3, minutes: -9, expected: false },
        { timeStep: 3, minutes: -8, expected: true },
        { timeStep: 3, minutes: 6, expected: true },
        { timeStep: 3, minutes: 7, expected: false },
        // timeStep 2 min
        { timeStep: 2, minutes: -5, expected: false },
        { timeStep: 2, minutes: -4, expected: true },
        { timeStep: 2, minutes: 5, expected: true },
        { timeStep: 2, minutes: 6, expected: false },
        // timeStep 1 min
        { timeStep: 1, minutes: -3, expected: false },
        { timeStep: 1, minutes: -2, expected: true },
        { timeStep: 1, minutes: 2, expected: true },
        { timeStep: 1, minutes: 3, expected: false },
        // timeStep 0.1 min
        { timeStep: 0.1, minutes: -0.3, expected: false },
        { timeStep: 0.1, minutes: -0.2, expected: true },
        { timeStep: 0.1, minutes: 0.2, expected: true },
        { timeStep: 0.1, minutes: 0.3, expected: false },
    ];

    testData.forEach(data => {
        const { timeStep, minutes, expected } = data;

        test(`returns ${expected} for valid TOTP code with modifier, minutes delay: ${minutes}`, () => {
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, modifier, timeStep)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, modifier, timeStep)
            );

            expect(isValid).toBe(expected);
        });

        test(`returns ${expected} for valid TOTP code without modifier, minutes delay: ${minutes}`, () => {
            let code: number = 0;
            mockNewDate(
                new Date(mockDateEpoc),
                () => code = totp.generateCode(token, undefined, timeStep)
            );

            let isValid = false;
            mockNewDate(
                new Date(mockDateEpoc + minutes * 60 * 1000),
                () => isValid = totp.validateCode(code, token, undefined, timeStep)
            );

            expect(isValid).toBe(expected);
        });
    });
});

describe("TOTP", () => {
    test("generateCode", () => {
        const t = new totp.TOTP("soub@WOOL8pow-mol");
        let code: number = 0;
        mockNewDate(
            new Date(mockDateEpoc),
            () => code = t.generateCode()
        );

        expect(code).toBe(990874);
    });

    test("validateCode", () => {
        const t = new totp.TOTP("soub@WOOL8pow-mol");
        let code: number = 0;
        mockNewDate(
            new Date(mockDateEpoc),
            () => code = t.generateCode()
        );

        let isValid: boolean = false;
        mockNewDate(
            new Date(mockDateEpoc),
            () => isValid = t.validateCode(code)
        );

        expect(isValid).toBe(true);
    });
});