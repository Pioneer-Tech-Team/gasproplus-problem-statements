import Fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import { z } from "zod";

const server = Fastify();
const prisma = new PrismaClient();

server.register(cors, { origin: "*" });

// get accounts
server.get("/accounts", async (req, reply) => {
  const accounts = await prisma.account.findMany();
  reply.send(accounts);
});

// createe account
server.post("/accounts", async (req, reply) => {
  const AccountSchema = z.object({
    name: z.string(),
    is_group: z.boolean(),
    parent_id: z.number().optional(),
  });

  const parsed = AccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const newAccount = await prisma.account.create({
    data: {
      name: parsed.data.name,
      is_group: parsed.data.is_group,
      parent_id: parsed.data.parent_id || null,
      path: "",
    },
  });

  reply.send(newAccount);
});

// update account
server.put("/accounts/:id", async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const AccountSchema = z.object({
    name: z.string(),
    is_group: z.boolean(),
    parent_id: z.number().optional(),
  });

  const parsed = AccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(parsed.error);
  }

  const updatedAccount = await prisma.account.update({
    where: { id: Number(req.params.id) },
    data: {
      name: parsed.data.name,
      is_group: parsed.data.is_group,
      parent_id: parsed.data.parent_id || null,
    },
  });

  reply.send(updatedAccount);
});

// eelete account with id
server.delete("/accounts/:id", async (req: FastifyRequest<{ Params: { id: string } }>, reply) => {
  await prisma.account.delete({
    where: { id: Number(req.params.id) },
  });

  reply.send({ message: "Account deleted successfully" });
});

// start server
server.listen({ port: 4000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
