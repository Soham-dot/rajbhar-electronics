import { z } from "zod";

const textField = (maxLength: number) => z.string().trim().max(maxLength);

export const adminLoginBodySchema = z
  .object({
    username: textField(80).min(1),
    password: z.string().min(1).max(200),
  })
  .strip();

export const contactBodySchema = z
  .object({
    name: textField(120).optional().default(""),
    phone: textField(30).optional().default(""),
    tvBrand: textField(120).optional().default(""),
    issue: textField(1200).optional().default(""),
  })
  .strip();

export const bookingCartItemSchema = z
  .object({
    serviceId: textField(80).min(1),
    issueId: textField(80).min(1),
    quantity: z.coerce.number().int().min(1).max(100),
  })
  .strip();

export const bookingBodySchema = z
  .object({
    name: textField(120).optional().default(""),
    phone: textField(30).optional().default(""),
    address: textField(320).optional().default(""),
    date: textField(40).optional().default(""),
    time: textField(40).optional().default(""),
    appliedCoupon: textField(40).nullable().optional().default(""),
    cart: z.array(z.unknown()).max(100).optional().default([]),
  })
  .strip();

export const couponCheckBodySchema = z
  .object({
    phone: textField(30).optional().default(""),
    coupon: textField(40).optional().default(""),
  })
  .strip();

export const leadStatusBodySchema = z
  .object({
    status: z.enum(["in_process", "closed"]),
  })
  .strip();
