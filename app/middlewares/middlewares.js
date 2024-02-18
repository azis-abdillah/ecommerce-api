import prisma from "../prisma.js";

export const authToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  const validToken = await prisma.token.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_blocked: true,
          role_id: true,
        },
      },
    },
  });

  if (!validToken) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (validToken.expires_at < new Date()) {
    return res.status(401).json({
      message: "Expired token",
    });
  }

  if (validToken.user.is_blocked) {
    return res.status(401).json({
      message: "Blocked user",
    });
  }

  req.user = validToken.user;

  next();
};

export async function validateProductId(req, res, next) {
  const product_id = Number(req.params.id) || Number(req.body.product_id);

  if (isNaN(product_id)) {
    return res.status(400).json({ message: "id must be a number" });
  }

  const product = await prisma.product.findUnique({
    where: { id: product_id },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  req.product_id = product_id;

  next();
}

export const checkProductSeller = async (req, res, next) => {
  const { product_id } = req;
  const product = await prisma.product.findUnique({
    where: { id: product_id },
  });
  if (product.seller_id !== req.user.id) {
    return res.status(401).json({ message: "You are not authorized" });
  }
  next();
};

export const checkSellerBuysHisProduct = async (req, res, next) => {
  const { product_id } = req;
  const product = await prisma.product.findUnique({
    where: { id: product_id },
  });
  if (product.seller_id === req.user.id) {
    return res.status(403).json({ message: "Seller can not buy his product" });
  }
  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map(
      (record) => record.permission.name
    );

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
