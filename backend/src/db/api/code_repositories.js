
const db = require('../models');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Code_repositoriesDBApi {

    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const code_repositories = await db.code_repositories.create(
            {
                id: data.id || undefined,

        client_folder: data.client_folder
        ||
        null
            ,

        server_folder: data.server_folder
        ||
        null
            ,

            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        return code_repositories;
    }

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const code_repositoriesData = data.map((item, index) => ({
                id: item.id || undefined,

                client_folder: item.client_folder
            ||
            null
            ,

                server_folder: item.server_folder
            ||
            null
            ,

            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const code_repositories = await db.code_repositories.bulkCreate(code_repositoriesData, { transaction });

        return code_repositories;
    }

    static async update(id, data, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const code_repositories = await db.code_repositories.findByPk(id, {}, {transaction});

        const updatePayload = {};

        if (data.client_folder !== undefined) updatePayload.client_folder = data.client_folder;

        if (data.server_folder !== undefined) updatePayload.server_folder = data.server_folder;

        updatePayload.updatedById = currentUser.id;

        await code_repositories.update(updatePayload, {transaction});

        return code_repositories;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const code_repositories = await db.code_repositories.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of code_repositories) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of code_repositories) {
                await record.destroy({transaction});
            }
        });

        return code_repositories;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const code_repositories = await db.code_repositories.findByPk(id, options);

        await code_repositories.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await code_repositories.destroy({
            transaction
        });

        return code_repositories;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const code_repositories = await db.code_repositories.findOne(
            { where },
            { transaction },
        );

        if (!code_repositories) {
            return code_repositories;
        }

        const output = code_repositories.get({plain: true});

        return output;
    }

    static async findAll(filter, options) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        const user = (options && options.currentUser) || null;

        offset = currentPage * limit;

        const orderBy = null;

        const transaction = (options && options.transaction) || undefined;

        let include = [];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

                if (filter.client_folder) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'code_repositories',
                            'client_folder',
                            filter.client_folder,
                        ),
                    };
                }

                if (filter.server_folder) {
                    where = {
                        ...where,
                        [Op.and]: Utils.ilike(
                            'code_repositories',
                            'server_folder',
                            filter.server_folder,
                        ),
                    };
                }

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.code_repositories.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset) {
        let where = {};

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'code_repositories',
                        'client_folder',
                        query,
                    ),
                ],
            };
        }

        const records = await db.code_repositories.findAll({
            attributes: [ 'id', 'client_folder' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            orderBy: [['client_folder', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.client_folder,
        }));
    }

};

